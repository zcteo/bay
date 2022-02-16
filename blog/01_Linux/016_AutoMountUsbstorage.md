# 自动挂载 U 盘

[toc]

## 踩过的坑

这些方法都是某度搜索可以找到的，而且个个都是原创，个个都一模一样，却没有一个能真正的解决问题

U 盘拔插确实能创建或者删除挂载点，但是并没有成功挂载

### udev mount

`/etc/udev/rules.d/10-usbstorage.rules`

```
KERNEL!="sd*", GOTO="auto_mount_end"
SUBSYSTEM!="block", GOTO="auto_mount_end"
IMPORT{program}="/sbin/blkid -o udev -p %N"
ENV{ID_FS_TYPE}=="", GOTO="auto_mount_end"
ENV{ID_FS_LABEL}!="", ENV{dir_name}="%E{ID_FS_LABEL}"
ENV{ID_FS_LABEL}=="", ENV{dir_name}="Untitled-%k"
ACTION=="add", ENV{mount_options}="relatime,sync"
ACTION=="add", ENV{ID_FS_TYPE}=="vfat", ENV{mount_options}="iocharset=utf8,umask=000"
ACTION=="add", ENV{ID_FS_TYPE}=="ntfs", ENV{mount_options}="iocharset=utf8,umask=000"
ACTION=="add", RUN+="/bin/mkdir -p /media/%E{dir_name}", RUN+="/bin/mount -o $env{mount_options} /dev/%k /media/%E{dir_name}"
ACTION=="remove", ENV{dir_name}!="", RUN+="/bin/umount -l /media/%E{dir_name}", RUN+="/bin/rmdir /media/%E{dir_name}"
LABEL="auto_mount_end"
```



### udev systemd-mount

这个说得跟真的一样，找了很久，还以为找到解决方案了，可还是不行

`/etc/udev/rules.d/10-usbstorage.rules`

```
KERNEL!="sd*", GOTO="auto_mount_end"
SUBSYSTEM!="block",GOTO="auto_mount_end"
IMPORT{program}="/sbin/blkid -o udev -p %N"
ENV{ID_FS_TYPE}=="", GOTO="auto_mount_end"
ENV{ID_FS_LABEL}!="", ENV{dir_name}="%E{ID_FS_LABEL}"
ENV{ID_FS_LABEL}=="", ENV{dir_name}="%E{ID_FS_UUID}"
ACTION=="add", ENV{mount_options}="relatime,sync"
ACTION=="add", RUN+="/bin/mkdir -p /media/%E{dir_name}", RUN+="/usr/bin/systemd-mount -o %E{mount_options} --no-block --automount=yes --collect /dev/%k /media/%E{dir_name}"
ACTION=="remove", ENV{dir_name}!="", RUN+="/usr/bin/systemd-mount --umount /media/%E{dir_name}", RUN+="/bin/rmdir /media/%E{dir_name}" 
LABEL="auto_mount_end"
```



## 终极解决方案

最后不得不放弃某度，搬出我的梯子，去外面看看，就找到解决方案了

<https://serverfault.com/questions/766506/>

大体思路是，udev 调用 systemd 的单元来完成挂载工作，就需要一个 udev rule 文件，一个 systemd 配置文件以及一个实际处理挂载和卸载设备的 shell 脚本

`/usr/local/bin/usbstorage-mount.sh`

```shell
#!/bin/bash

# This script is called from our systemd unit file to mount or unmount
# a USB drive.

usage()
{
    echo "Usage: $0 {add|remove} device_name (e.g. sdb1)"
    exit 1
}

if [[ $# -ne 2 ]]; then
    usage
fi

ACTION=$1
DEVBASE=$2
DEVICE="/dev/${DEVBASE}"

# See if this drive is already mounted, and if so where
MOUNT_POINT=$(/bin/mount | /bin/grep ${DEVICE} | /usr/bin/awk '{ print $3 }')

do_mount()
{
    if [[ -n ${MOUNT_POINT} ]]; then
        echo "Warning: ${DEVICE} is already mounted at ${MOUNT_POINT}"
        exit 1
    fi

    # Get info for this drive: $ID_FS_LABEL, $ID_FS_UUID, and $ID_FS_TYPE
    eval $(/sbin/blkid -o udev ${DEVICE})

    # Figure out a mount point to use
    LABEL=${ID_FS_LABEL}
    if [[ -z "${LABEL}" ]]; then
        LABEL=${DEVBASE}
    elif /bin/grep -q " /media/${LABEL} " /etc/mtab; then
        # Already in use, make a unique one
        LABEL+="-${DEVBASE}"
    fi
    MOUNT_POINT="/media/${LABEL}"

    echo "Mount point: ${MOUNT_POINT}"

    /bin/mkdir -p ${MOUNT_POINT}

    # Global mount options
    OPTS="rw,relatime"

    # File system type specific mount options
    if [[ ${ID_FS_TYPE} == "vfat" ]]; then
        OPTS+=",users,gid=100,umask=000,shortname=mixed,utf8=1,flush"
    fi

    if ! /bin/mount -o ${OPTS} ${DEVICE} ${MOUNT_POINT}; then
        echo "Error mounting ${DEVICE} (status = $?)"
        /bin/rmdir ${MOUNT_POINT}
        exit 1
    fi

    echo "**** Mounted ${DEVICE} at ${MOUNT_POINT} ****"
}

do_unmount()
{
    if [[ -z ${MOUNT_POINT} ]]; then
        echo "Warning: ${DEVICE} is not mounted"
    else
        /bin/umount -l ${DEVICE}
        echo "**** Unmounted ${DEVICE}"
    fi

    # Delete all empty dirs in /media that aren't being used as mount
    # points. This is kind of overkill, but if the drive was unmounted
    # prior to removal we no longer know its mount point, and we don't
    # want to leave it orphaned...
    for f in /media/* ; do
        if [[ -n $(/usr/bin/find "$f" -maxdepth 0 -type d -empty) ]]; then
            if ! /bin/grep -q " $f " /etc/mtab; then
                echo "**** Removing mount point $f"
                /bin/rmdir "$f"
            fi
        fi
    done
}

case "${ACTION}" in
    add)
        do_mount
        ;;
    remove)
        do_unmount
        ;;
    *)
        usage
        ;;
esac
```



`/lib/systemd/system/usb-mount@.service`

```bash
[Unit]
Description=Mount USB Drive on %i

[Service]
Type=oneshot
RemainAfterExit=true
ExecStart=/usr/local/bin/usbstorage-mount.sh add %i
ExecStop=/usr/local/bin/usbstorage-mount.sh remove %i
```



`/etc/udev/rules.d/10-usbstorage.rules`

```
KERNEL!="sd*", GOTO="auto_mount_end"
SUBSYSTEM!="block", GOTO="auto_mount_end"
ACTION=="add", RUN+="/bin/systemctl start usb-mount@%k.service"
ACTION=="remove", RUN+="/bin/systemctl stop usb-mount@%k.service"
LABEL="auto_mount_end"
```



文件放在指定位置之后，执行以下命令

```bash
# 重新加载 udev rules 文件
udevadm control --reload-rules
# 重新加载 systemd unit 文件
systemctl daemon-reload
```



