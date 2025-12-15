import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BuildIcon from '@mui/icons-material/Build';
import TimelineIcon from '@mui/icons-material/Timeline';
import ApiIcon from '@mui/icons-material/Api';
import WebIcon from '@mui/icons-material/Web';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import GitHubIcon from '@mui/icons-material/GitHub';

const Technical: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CodeIcon sx={{ fontSize: '2.5rem' }} />
            Technical Architecture
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            Vienna Life Assistant - Built with Modern AI-First Architecture
          </Typography>
          <Alert severity="warning" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            <strong>⚠️ Advanced Technical Content:</strong> This documentation assumes familiarity with software development concepts.
            If you're not a developer, you might find some sections challenging, but we've structured it hierarchically for clarity.
          </Alert>
        </Paper>

        {/* Core Philosophy */}
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PsychologyIcon color="primary" />
              Development Philosophy: Flow Engineering
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
              "Flow Engineering is the practice of designing software systems that prioritize developer experience (DX)
              and operational excellence, creating environments where innovation flows naturally and complexity is managed elegantly."
              - Inspired by Simon Willison's approach to building with AI
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">Key Principles:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>🚀 Fast Iteration</Typography>
                    <Typography variant="body2">
                      Docker containers for instant development environments.
                      Hot reloading, automated testing, and seamless deployment.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>🔧 Developer Experience</Typography>
                    <Typography variant="body2">
                      Cursor IDE with AI assistance, comprehensive documentation,
                      automated tooling, and clear architectural patterns.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>🎯 AI-First Design</Typography>
                    <Typography variant="body2">
                      Built around AI capabilities from day one. MCP servers,
                      streaming responses, and intelligent automation.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Tech Stack Overview */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ArchitectureIcon color="primary" />
              Tech Stack Architecture
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom color="primary">Frontend Stack:</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WebIcon color="primary" />
                      React 18 + TypeScript
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Modern React with hooks, TypeScript for type safety, and Material-UI for consistent design.
                      Built with Vite for lightning-fast development and optimized production builds.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label="React 18" color="primary" />
                      <Chip size="small" label="TypeScript" color="secondary" />
                      <Chip size="small" label="Material-UI" color="success" />
                      <Chip size="small" label="Vite" color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>State Management & Data</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Zustand for client-side state, TanStack Query for server state,
                      Axios for API communication, and React Router for navigation.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label="Zustand" color="primary" />
                      <Chip size="small" label="TanStack Query" color="secondary" />
                      <Chip size="small" label="Axios" color="success" />
                      <Chip size="small" label="React Router" color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom color="primary">Backend Stack:</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ApiIcon color="primary" />
                      FastAPI + Python
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Async-first web framework with automatic OpenAPI documentation,
                      Pydantic for data validation, and SQLAlchemy for database operations.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label="FastAPI" color="primary" />
                      <Chip size="small" label="Python 3.11" color="secondary" />
                      <Chip size="small" label="Pydantic v2" color="success" />
                      <Chip size="small" label="SQLAlchemy" color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Database & Caching</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      PostgreSQL for data persistence, Redis for caching and Celery broker,
                      with async database drivers for high performance.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label="PostgreSQL" color="primary" />
                      <Chip size="small" label="Redis" color="secondary" />
                      <Chip size="small" label="AsyncPG" color="success" />
                      <Chip size="small" label="Celery" color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom color="primary">Infrastructure & DevOps:</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Docker Desktop</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Containerized development environment with hot reloading,
                      multi-service orchestration, and consistent deployment.
                    </Typography>
                    <Chip size="small" label="Docker Compose" color="primary" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Monitoring Stack</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Grafana, Prometheus, Loki for comprehensive observability.
                      Real-time metrics, logging, and alerting.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip size="small" label="Grafana" color="primary" />
                      <Chip size="small" label="Prometheus" color="secondary" />
                      <Chip size="small" label="Loki" color="success" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Version Control</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Git with GitHub for collaboration, GitHub Actions for CI/CD,
                      and semantic versioning for releases.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip size="small" label="Git" color="primary" />
                      <Chip size="small" label="GitHub" color="secondary" />
                      <Chip size="small" label="Cursor IDE" color="success" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Celery Background Tasks */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BuildIcon color="primary" />
              Celery: Distributed Task Processing
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Celery is a distributed task queue system that enables asynchronous processing of background tasks.
              In Vienna Life Assistant, it powers features like email notifications, data analysis, and scheduled maintenance.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">How Celery Works:</Typography>
            <List>
              <ListItem>
                <ListItemIcon><TimelineIcon /></ListItemIcon>
                <ListItemText
                  primary="Task Submission"
                  secondary="API routes submit tasks to Redis queue using celery_app.task_name.delay()"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText
                  primary="Message Broker"
                  secondary="Redis stores task messages and acts as the communication channel"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><BuildIcon /></ListItemIcon>
                <ListItemText
                  primary="Worker Processing"
                  secondary="Background worker processes execute tasks asynchronously"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><TimelineIcon /></ListItemIcon>
                <ListItemText
                  primary="Result Storage"
                  secondary="Task results stored in Redis for retrieval by the application"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>Current Tasks:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Email Tasks</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Welcome emails, daily summaries, weekly reports, and notifications.
                    </Typography>
                    <Chip size="small" label="send_welcome_email" />
                    <Chip size="small" label="send_daily_summary" sx={{ ml: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>AI Tasks</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Long-running AI analysis, personalized recommendations, and automated insights.
                    </Typography>
                    <Chip size="small" label="process_long_ai_analysis" />
                    <Chip size="small" label="personalize_recommendations" sx={{ ml: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Maintenance Tasks</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Database cleanup, optimization, and scheduled maintenance operations.
                    </Typography>
                    <Chip size="small" label="cleanup_old_conversations" />
                    <Chip size="small" label="optimize_database" sx={{ ml: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>User Experience</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Personalized content, external data sync, and enhanced user interactions.
                    </Typography>
                    <Chip size="small" label="sync_external_data" />
                    <Chip size="small" label="send_notification" sx={{ ml: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>Usage Examples:</Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                # Submit task asynchronously (returns immediately)<br/>
                result = send_welcome_email.delay("user@example.com", "John Doe")<br/>
                <br/>
                # Check task status<br/>
                if result.ready():<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;print("Task completed:", result.get())<br/>
                <br/>
                # Schedule periodic task<br/>
                celery_app.conf.beat_schedule = &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;'daily-report': &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'task': 'workers.tasks.send_daily_summary',<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'schedule': timedelta(hours=24),<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                &#125;
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* MCP Server Architecture */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ApiIcon color="primary" />
              MCP Server Architecture
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 3 }}>
              The Vienna Life Assistant uses a revolutionary Multi-MCP (Model Context Protocol) Server Architecture
              that allows the AI chatbot to seamlessly integrate with external services and your entire digital ecosystem.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">How MCP Works:</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>MCP Clients</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Client applications that connect to MCP servers. In our case, the FastAPI backend
                      acts as an MCP client to communicate with specialized servers.
                    </Typography>
                    <Chip size="small" label="FastAPI Backend" color="primary" />
                    <Chip size="small" label="STDIO Transport" color="secondary" sx={{ ml: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>MCP Servers</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Specialized servers that expose tools for specific domains. Each server provides
                      a set of functions that the AI can call to perform tasks.
                    </Typography>
                    <Chip size="small" label="Advanced Memory" color="primary" />
                    <Chip size="small" label="Tapo Camera" color="secondary" sx={{ ml: 1 }} />
                    <Chip size="small" label="Plex Media" color="success" sx={{ ml: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom color="primary">Integrated MCP Servers:</Typography>
            <List>
              <ListItem>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText
                  primary="Advanced Memory MCP"
                  secondary="Personal knowledge base and Zettelkasten system. Search, create, and manage notes."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SmartToyIcon /></ListItemIcon>
                <ListItemText
                  primary="Tapo MCP"
                  secondary="Smart home control (lights, cameras, Ring doorbell integration)."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><WebIcon /></ListItemIcon>
                <ListItemText
                  primary="Plex MCP"
                  secondary="Media library access (movies, TV shows, anime collection)."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CodeIcon /></ListItemIcon>
                <ListItemText
                  primary="Calibre MCP"
                  secondary="Ebook management and reading integration."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CloudIcon /></ListItemIcon>
                <ListItemText
                  primary="Ollama MCP"
                  secondary="Local LLM inference for AI processing."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText
                  primary="Immich MCP"
                  secondary="Photo management and memory integration."
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>MCP Communication Flow:</Typography>
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
                User Query → AI Chatbot → FastAPI Backend → MCP Client Manager<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
                STDIO Transport → Specific MCP Server → Tool Execution<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
                Results → AI Chatbot → Formatted Response to User
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* AI/LLM Integration */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SmartToyIcon color="primary" />
              AI/LLM Integration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Vienna Life Assistant features advanced AI capabilities with support for both local and cloud LLM providers,
              intelligent conversation memory, and specialized AI tools for enhanced user experience.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">LLM Providers:</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Local AI (Ollama)</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Privacy-first local AI with models like Llama 3.2, Mistral, and Phi-3.
                      No cloud dependency, runs on your RTX 4070 or better.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label="Llama 3.2" color="primary" />
                      <Chip size="small" label="Mistral" color="secondary" />
                      <Chip size="small" label="Phi-3" color="success" />
                      <Chip size="small" label="Privacy-First" color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Cloud AI (OpenAI/Anthropic)</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Access to GPT-4, Claude Opus, and other cutting-edge models.
                      Configurable API keys with usage tracking and cost management.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip size="small" label="GPT-4" color="primary" />
                      <Chip size="small" label="Claude" color="secondary" />
                      <Chip size="small" label="API Keys" color="success" />
                      <Chip size="small" label="Usage Tracking" color="warning" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom color="primary">Advanced Chat Features:</Typography>
            <List>
              <ListItem>
                <ListItemIcon><TimelineIcon /></ListItemIcon>
                <ListItemText
                  primary="Streaming Responses"
                  secondary="Real-time text generation with immediate display for better user experience"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><PsychologyIcon /></ListItemIcon>
                <ListItemText
                  primary="Bot Personalities"
                  secondary="Multiple AI personalities (Vienna Local, Expert, Creative, etc.) for different interaction styles"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><BuildIcon /></ListItemIcon>
                <ListItemText
                  primary="Prompt Enhancement"
                  secondary="AI-powered prompt refinement and optimization before sending to LLM"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><ApiIcon /></ListItemIcon>
                <ListItemText
                  primary="Tool Integration"
                  secondary="Automatic detection and execution of tools (calculator, weather, web search, etc.)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><StorageIcon /></ListItemIcon>
                <ListItemText
                  primary="Conversation Memory"
                  secondary="Persistent conversation history with intelligent context management"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Future Plans */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TimelineIcon color="primary" />
              Future Development Roadmap
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 3 }}>
              The Vienna Life Assistant is designed for continuous evolution, with clear development priorities
              and architectural flexibility for future enhancements.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">Phase 4: Advanced AI Integration</Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemText
                  primary="Multi-Modal AI"
                  secondary="Support for images, audio, and video in conversations"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Voice Commands"
                  secondary="Natural language voice input and responses"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="AI Agents"
                  secondary="Specialized AI agents for specific tasks (travel planning, financial advice, etc.)"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom color="primary">Phase 5: Ecosystem Expansion</Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemText
                  primary="Mobile App"
                  secondary="Native iOS and Android apps with offline capabilities"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Multi-User Support"
                  secondary="Family accounts, shared spaces, and collaborative features"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="API Marketplace"
                  secondary="Third-party integrations and custom MCP server marketplace"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom color="primary">Technical Improvements</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Performance Optimization"
                  secondary="Advanced caching, database optimization, and response time improvements"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Security Hardening"
                  secondary="End-to-end encryption, advanced authentication, and privacy features"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Scalability"
                  secondary="Microservices architecture, horizontal scaling, and cloud deployment options"
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* GitHub Links */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GitHubIcon />
            Open Source Ecosystem
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vienna Life Assistant is built on a foundation of open-source MCP servers. Each component is independently developed and maintained.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href="https://github.com/sandraschi/vienna-life-assistant"
                target="_blank"
                rel="noopener"
                fullWidth
                component="a"
              >
                Main Repository
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<CodeIcon />}
                href="https://github.com/sandraschi/advanced-memory-mcp"
                target="_blank"
                rel="noopener"
                fullWidth
                component="a"
              >
                Advanced Memory MCP
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<CodeIcon />}
                href="https://github.com/sandraschi/tapo-camera-mcp"
                target="_blank"
                rel="noopener"
                fullWidth
                component="a"
              >
                Tapo Camera MCP
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<CodeIcon />}
                href="https://github.com/sandraschi/plex-mcp"
                target="_blank"
                rel="noopener"
                fullWidth
                component="a"
              >
                Plex MCP
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Technical;
