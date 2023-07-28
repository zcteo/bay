# FFmpeg 解码视频

[TOC]

## 自动探测文件格式

### 从文件解码

```cpp
AVFormatContext *formatCtx = avformat_alloc_context();
auto ret = avformat_open_input(&formatCtx, "1.h264", nullptr, nullptr);
if (ret < 0) {
    // error
}
ret = avformat_find_stream_info(formatCtx, nullptr);
int streamIndex = -1;
for (int i = 0; i < (int)formatCtx->nb_streams; ++i) {
    if (formatCtx->streams[i]->codecpar->codec_type == AVMEDIA_TYPE_VIDEO) {
        streamIndex = i;
        break;
    }
}
if(streamIndex == 0) {
    // error
}
auto *decodeParam = formatCtx->streams[streamIndex]->codecpar;
auto *decoder = avcodec_find_decoder(decodeParam->codec_id);
auto *decoderCtx = avcodec_alloc_context3(decoder);
ret = avcodec_parameters_to_context(decoderCtx, decodeParam);
ret = avcodec_open2(decoderCtx, decoder, nullptr);
auto *yuvFrame = av_frame_alloc();
auto *packet = av_packet_alloc();
while (av_read_frame(formatCtx, packet) >= 0) {
    if (packet->stream_index != streamIndex) {
        continue;
    }
    ret = avcodec_send_packet(decoderCtx, packet);
    ret = avcodec_receive_frame(decoderCtx, yuvFrame);
    if (ret == 0) {
        // do sth
    }
}
// 送空指针表示解码结束了
ret = avcodec_send_packet(decoderCtx, nullptr);
// 接收剩余解码数据
while (avcodec_receive_frame(decoderCtx, yuvFrame) == 0) {
    // do sth
}
// clear
```



### 从内存解码

```cpp
// opaque为avio_alloc_context的opaque参数
int FillData(void *opaque, uint8_t *buf, int buf_size) {
    if (bufferIndex >= bufferSize) {
        return AVERROR_EOF;
    }
    int cpLen;
    if (bufferSize - bufferIndex < buf_size) {
        cpLen = bufferSize - bufferIndex;
    } else {
        cpLen = buf_size;
    }
    bufferIndex += cpLen;
    memcpy(buf, opaque, static_cast<size_t>(cpLen));
    return cpLen;
}
void VideoToJpegBuff() {
    auto *file = fopen("test.h265", "rb");
    int ret = fseek(file, 0, SEEK_END);
    if (ret < 0) {}
    int size = (int)ftell(file);
    bufferSize = size;
    ret = fseek(file, 0, SEEK_SET);
    auto *dataBuffer = new uint8_t[size];
    ret = fread(dataBuffer, 1, size, file);
    fclose(file);

    auto *formatCtx = avformat_alloc_context();
    // 给FFmpeg内部使用的buffer
    auto *buffer = static_cast<unsigned char *>(av_malloc(1024 * 1024 * 5));
    formatCtx->pb = avio_alloc_context(buffer, 1024 * 1024 * 5, 0, dataBuffer, FillData, nullptr, nullptr);
    ret = avformat_open_input(&formatCtx, nullptr, nullptr, nullptr);
    if (ret != 0) {}
    ret = avformat_find_stream_info(formatCtx, nullptr);
    int streamIndex = -1;
    for (int i = 0; i < (int)formatCtx->nb_streams; ++i) {
        if (formatCtx->streams[i]->codecpar->codec_type == AVMEDIA_TYPE_VIDEO) {
            streamIndex = i;
            break;
        }
    }
    auto *decodeParam = formatCtx->streams[streamIndex]->codecpar;
    auto *decoder = avcodec_find_decoder(decodeParam->codec_id);
    auto *decoderCtx = avcodec_alloc_context3(decoder);
    decoderCtx->thread_count = 20;
    ret = avcodec_parameters_to_context(decoderCtx, decodeParam);
    ret = avcodec_open2(decoderCtx, decoder, nullptr);
    auto *yuvFrame = av_frame_alloc();
    auto *packet = av_packet_alloc();
    while (av_read_frame(formatCtx, packet) >= 0) {
        if (packet->stream_index != streamIndex) {
            continue;
        }
        ret = avcodec_send_packet(decoderCtx, packet);
        ret = avcodec_receive_frame(decoderCtx, yuvFrame);
        if (ret == 0) {
            // do sth
        }
    }
    ret = avcodec_send_packet(decoderCtx, nullptr);
    while (avcodec_receive_frame(decoderCtx, yuvFrame) == 0) {
        // do sth
    }
    // clear
}
```



## 保存为 JPEG

```cpp
void Save2Jpeg(AVFrame *frame) {
    auto *encoder = avcodec_find_encoder(AV_CODEC_ID_MJPEG);
    auto *encodeCtx = avcodec_alloc_context3(encoder);
    encodeCtx->width = frame->width;
    encodeCtx->height = frame->height;
    encodeCtx->time_base = {1, 25};
    encodeCtx->pix_fmt = AV_PIX_FMT_YUVJ420P;
    int ret = avcodec_open2(encodeCtx, encoder, nullptr);
    if (ret < 0) {
        // error
    }
    auto *swsCtx = sws_getContext(frame->width, frame->height, static_cast<AVPixelFormat>(frame->format),
                                  encodeCtx->width, encodeCtx->height, AV_PIX_FMT_YUVJ420P, 
                                  SWS_POINT, nullptr, nullptr, nullptr);
    auto *jpegFrame = av_frame_alloc();
    jpegFrame->height = frame->height;
    jpegFrame->width = frame->width;
    jpegFrame->format = AV_PIX_FMT_YUVJ420P;
    ret = av_frame_get_buffer(jpegFrame, 0);
    ret = sws_scale_frame(swsCtx, jpegFrame, frame);
    auto *packet = av_packet_alloc();
    ret = avcodec_send_frame(encodeCtx, frame);
    // 编码结束
    ret = avcodec_send_frame(encodeCtx, nullptr);
    ret = avcodec_receive_packet(encodeCtx, packet);

    auto *file = fopen("111.jpeg", "wb+");
    fwrite(packet->data, 1, static_cast<size_t>(packet->size), file);
    fclose(file);
    // clear
}
```

