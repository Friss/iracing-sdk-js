#pragma once

#include "irsdk/irsdk_defines.h"
#include "platform/platform.h"

namespace NodeIrSdk
{
#ifdef _WIN32
  void broadcastCmd(int cmd, int var1, int var2);
  void broadcastCmd(int cmd, int var1, int var2, int var3);
#else
  // On non-Windows platforms, these are no-ops since iRacing only runs on Windows
  inline void broadcastCmd(int cmd, int var1, int var2) {}
  inline void broadcastCmd(int cmd, int var1, int var2, int var3) {}
#endif
}
