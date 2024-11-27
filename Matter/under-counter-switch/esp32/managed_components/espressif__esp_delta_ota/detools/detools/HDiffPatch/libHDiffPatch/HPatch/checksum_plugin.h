/*
 * The MIT License (MIT)
 * Copyright (c) 2018-2019 HouSisong
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

#ifndef HPATCH_CHECKSUM_PLUGIN_H
#define HPATCH_CHECKSUM_PLUGIN_H

#include "patch_types.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef void*  hpatch_checksumHandle;
typedef struct hpatch_TChecksum {
    const char *(*checksumType)(void);
    size_t (*checksumByteSize)(void);
    hpatch_checksumHandle (*open)(struct hpatch_TChecksum* plugin);
    void (*close)(struct hpatch_TChecksum *plugin, hpatch_checksumHandle handle);
    void (*begin)(hpatch_checksumHandle handle);
    void (*append)(hpatch_checksumHandle handle,
                   const unsigned char *part_data,
                   const unsigned char *part_data_end);
    void (*end)(hpatch_checksumHandle handle,
                unsigned char *checksum,
                unsigned char *checksum_end);
} hpatch_TChecksum;

#ifdef __cplusplus
}
#endif

#endif
