# Per-repo fleet start config for vienna-life-assistant
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'vienna-life-assistant'
    RepoRoot     = 'D:\Dev\repos\vienna-life-assistant'
    BackendPort  = 10922
    FrontendPort = 10988
    HealthPath   = '/health'
    WebRoot      = 'D:\Dev\repos\vienna-life-assistant\web_sota'
    Backend = @{
        Kind          = 'uvicorn'
        WorkDir       = 'D:\Dev\repos\vienna-life-assistant\web_sota'
        UvProject     = 'D:\Dev\repos\vienna-life-assistant\web_sota'
        UvicornTarget = 'vienna_life_assistant.server:app'
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
