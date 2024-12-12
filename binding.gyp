{
  "targets": [
    {
      "target_name": "IrSdkNodeBindings",
      "cflags": [
        "-Wall",
        "-std=c++17"
      ],
      "defines": [
        "NODE_MAJOR_VERSION=<!(node -v | cut -d. -f1 | tr -d 'v')"
      ],
      "sources": [
        "src/cpp/IrSdkNodeBindings.cpp",
        "src/cpp/IrSdkCommand.cpp",
        "src/cpp/IRSDKWrapper.cpp",
        "src/cpp/IrSdkBindingHelpers.cpp",
        "src/cpp/platform/platform.cpp"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "default_configuration": "Release",
      "conditions": [
        ["OS=='win'", {
          "configurations": {
            "Release": {
              "msvs_settings": {
                "VCCLCompilerTool": {
                  "ExceptionHandling": 1
                }
              }
            }
          }
        }],
        ["OS!='win'", {
          "libraries": [
            "-lrt",
            "-lpthread"
          ],
          "cflags": [
            "-D_POSIX_C_SOURCE=199309L"
          ]
        }]
      ]
    }
  ]
}
