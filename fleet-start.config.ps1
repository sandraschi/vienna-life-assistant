# Per-repo fleet start config for vienna-life-assistant
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'vienna-life-assistant'
    BackendPort  = 10922
    FrontendPort = 10931
    HealthPath   = '/health'
    WebRoot      = 'web_sota'
    Backend = @{
        Kind          = 'uvicorn'
        UvicornTarget = 'vienna_life_assistant.server:app'
        UvProject     = 'web_sota'
        WorkDir       = 'web_sota'
        PythonPath    = 'web_sota'
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
