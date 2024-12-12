#pragma once

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#else
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <semaphore.h>
#endif

namespace platform {

#ifdef _WIN32
using handle_t = HANDLE;
using sem_handle_t = HANDLE;
#else
using handle_t = int;
using sem_handle_t = sem_t*;
#endif

class SharedMemory {
public:
    SharedMemory();
    ~SharedMemory();
    
    bool open(const char* name);
    void close();
    void* getData() const;
    bool isOpen() const;

private:
    handle_t handle_;
    void* data_;
    size_t size_;
    
#ifdef _WIN32
    HANDLE fileMapping_;
#endif
};

class Event {
public:
    Event();
    ~Event();
    
    bool create(const char* name);
    void close();
    bool wait(int timeoutMs);
    bool isValid() const;

private:
    sem_handle_t handle_;
};

} // namespace platform