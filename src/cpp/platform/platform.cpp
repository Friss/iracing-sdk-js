#include "platform.h"
#include <cstring>
#include <string>

#ifndef _WIN32
#include <semaphore.h>
#include <time.h>
#define INFINITE -1
#endif

namespace platform
{

    SharedMemory::SharedMemory() : handle_(0), data_(nullptr), size_(0)
#ifdef _WIN32
                                   ,
                                   fileMapping_(NULL)
#endif
    {
    }

    SharedMemory::~SharedMemory()
    {
        close();
    }
#ifdef _WIN32
    bool SharedMemory::open(const _TCHAR *name)
    {

        fileMapping_ = OpenFileMapping(FILE_MAP_READ, FALSE, name);
        if (fileMapping_ == NULL)
        {
            return false;
        }
        data_ = MapViewOfFile(fileMapping_, FILE_MAP_READ, 0, 0, 0);
        return data_ != nullptr;
    }
#else

    bool SharedMemory::open(const char *name)
    {

        // On Unix systems, shared memory names must start with /
        std::string shmName = std::string("/") + (name[0] == '/' ? name + 1 : name);

        // Replace Windows path separator with underscore
        size_t pos = 0;
        while ((pos = shmName.find('\\', pos)) != std::string::npos)
        {
            shmName.replace(pos, 1, "_");
        }

        handle_ = shm_open(shmName.c_str(), O_RDONLY, 0666);
        if (handle_ == -1)
        {
            return false;
        }

        struct stat sb;
        if (fstat(handle_, &sb) == -1)
        {
            close();
            return false;
        }
        size_ = sb.st_size;

        data_ = mmap(nullptr, size_, PROT_READ, MAP_SHARED, handle_, 0);
        if (data_ == MAP_FAILED)
        {
            close();
            return false;
        }
        return true;
    }
#endif
    void SharedMemory::close()
    {
#ifdef _WIN32
        if (data_)
        {
            UnmapViewOfFile(data_);
            data_ = nullptr;
        }
        if (fileMapping_)
        {
            CloseHandle(fileMapping_);
            fileMapping_ = NULL;
        }
#else
        if (data_ && data_ != MAP_FAILED)
        {
            munmap(data_, size_);
            data_ = nullptr;
        }
        if (handle_ != -1)
        {
            ::close(handle_);
            handle_ = -1;
        }
#endif
    }

    void *SharedMemory::getData() const
    {
        return data_;
    }

    bool SharedMemory::isOpen() const
    {
#ifdef _WIN32
        return fileMapping_ != NULL && data_ != nullptr;
#else
        return handle_ != -1 && data_ != nullptr && data_ != MAP_FAILED;
#endif
    }

    Event::Event() : handle_(
#ifdef _WIN32
                         NULL
#else
                         SEM_FAILED
#endif
                     )
    {
    }

    Event::~Event()
    {
        close();
    }
#ifdef _WIN32
    bool Event::create(const _TCHAR *name)
    {
        handle_ = OpenEvent(SYNCHRONIZE, FALSE, name);
        return handle_ != NULL;
    }
#else

    bool Event::create(const char *name)
    {

        // On Unix systems we'll use a semaphore instead of an event
        std::string semName = std::string("/") + (name[0] == '/' ? name + 1 : name);

        // Replace Windows path separator with underscore
        size_t pos = 0;
        while ((pos = semName.find('\\', pos)) != std::string::npos)
        {
            semName.replace(pos, 1, "_");
        }

        handle_ = sem_open(semName.c_str(), O_CREAT, 0666, 0);
        return handle_ != SEM_FAILED;
    }
#endif
    void Event::close()
    {
#ifdef _WIN32
        if (handle_)
        {
            CloseHandle(handle_);
            handle_ = NULL;
        }
#else
        if (handle_ != SEM_FAILED)
        {
            sem_close(handle_);
            handle_ = SEM_FAILED;
        }
#endif
    }

    bool Event::wait(int timeoutMs)
    {
#ifdef _WIN32
        return WaitForSingleObject(handle_, timeoutMs) == WAIT_OBJECT_0;
#else
        if (timeoutMs == INFINITE)
        {
            return sem_wait(handle_) == 0;
        }

        struct timespec ts;
        clock_gettime(CLOCK_REALTIME, &ts);
        ts.tv_sec += timeoutMs / 1000;
        ts.tv_nsec += (timeoutMs % 1000) * 1000000;

        return sem_timedwait(handle_, &ts) == 0;
#endif
    }

    bool Event::isValid() const
    {
#ifdef _WIN32
        return handle_ != NULL;
#else
        return handle_ != SEM_FAILED;
#endif
    }

} // namespace platform
