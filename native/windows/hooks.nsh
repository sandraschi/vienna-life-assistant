; Kill UI + backend before install/uninstall (backend locks resources/*.exe).
!macro KillViennaLifeAssistantFleetProcesses
  DetailPrint "Stopping vienna-life-assistant processes..."
  ExecWait 'taskkill /F /IM vienna-life-assistant-backend.exe /T' $0
  ExecWait 'taskkill /F /IM vienna-life-assistant-native.exe /T' $0
  !if "${INSTALLMODE}" == "currentUser"
    nsis_tauri_utils::KillProcessCurrentUser "vienna-life-assistant-backend.exe"
    Pop $0
    nsis_tauri_utils::KillProcessCurrentUser "vienna-life-assistant-native.exe"
    Pop $0
  !else
    nsis_tauri_utils::KillProcess "vienna-life-assistant-backend.exe"
    Pop $0
    nsis_tauri_utils::KillProcess "vienna-life-assistant-native.exe"
    Pop $0
  !endif
  Sleep 2000
!macroend

!macro NSIS_HOOK_PREINSTALL
  !insertmacro KillViennaLifeAssistantFleetProcesses
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  !insertmacro KillViennaLifeAssistantFleetProcesses
!macroend

!macro NSIS_HOOK_POSTINSTALL
  IfFileExists "$INSTDIR\resources\install-mcp-clients.ps1" 0 mcp_hook_done
    DetailPrint "Optional: register vienna-life-assistant in Cursor / Claude Desktop"
    ExecWait 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\install-mcp-clients.ps1" -Interactive'
  mcp_hook_done:
!macroend