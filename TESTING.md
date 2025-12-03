# Vienna Life Assistant - Testing Guide

**Date**: 2025-12-03  
**Status**: ✅ Comprehensive Test Suite Ready

## Test Suite Overview

### Backend Tests (Pytest)

**Location**: `backend/tests/`

**Structure**:
```
tests/
├── conftest.py              # Pytest fixtures and configuration
├── test_health.py           # Health check tests
├── api/
│   ├── test_todos.py       # Todos API tests (14 tests)
│   ├── test_calendar.py    # Calendar API tests (6 tests)
│   ├── test_shopping.py    # Shopping API tests (5 tests)
│   └── test_llm.py         # LLM API tests (4 tests)
├── models/
│   └── test_todo_model.py  # Model tests (3 tests)
└── services/
    └── test_ollama.py      # Ollama service tests (3 tests)
```

**Total Tests**: 35+ tests

## Running Tests

### Quick Run (All Tests)
```powershell
cd D:\Dev\repos\vienna-life-assistant
.\run-tests.ps1
```

### With Coverage Report
```powershell
.\run-tests.ps1 -Coverage
```

### Verbose Output
```powershell
.\run-tests.ps1 -Verbose
```

### Run Specific Test File
```powershell
.\run-tests.ps1 -TestPath "tests/api/test_todos.py"
```

### Manual Run
```powershell
cd D:\Dev\repos\vienna-life-assistant\backend
.\venv\Scripts\Activate.ps1
pytest -v
```

## Test Categories

### API Tests

**Todos API** (`test_todos.py`):
- ✅ Create todo
- ✅ List todos (empty and with data)
- ✅ Get specific todo
- ✅ Update todo
- ✅ Delete todo
- ✅ Complete/uncomplete todo
- ✅ Get statistics
- ✅ Filter by priority
- ✅ Filter by completion status
- ✅ Handle non-existent todos

**Calendar API** (`test_calendar.py`):
- ✅ Create calendar event
- ✅ List events
- ✅ Get specific event
- ✅ Update event
- ✅ Delete event
- ✅ Validate event times

**Shopping API** (`test_shopping.py`):
- ✅ Get offers (empty state)
- ✅ Scrape with mock data
- ✅ Get offers after scraping
- ✅ Filter by store
- ✅ Get statistics

**LLM API** (`test_llm.py`):
- ✅ Get Ollama status
- ✅ List models
- ✅ Get recommended models
- ✅ Get running models

### Model Tests

**Todo Model** (`test_todo_model.py`):
- ✅ Create todo model
- ✅ Convert to dictionary
- ✅ Complete todo

### Service Tests

**Ollama Service** (`test_ollama.py`):
- ✅ Service initialization
- ✅ Connection checking
- ✅ List models

## Test Features

### Fixtures (conftest.py)

**Database Fixture** (`test_db`):
- Creates temporary SQLite database for each test
- Automatically cleaned up after test
- Isolated test environment

**Client Fixture** (`client`):
- FastAPI TestClient
- Makes HTTP requests to API
- No server needed (ASGI app testing)

**Sample Data Fixtures**:
- `sample_todo_data` - Todo test data
- `sample_calendar_event_data` - Event test data
- `sample_shopping_offer` - Shopping offer data

### Test Database

Each test runs in isolation with:
- Temporary SQLite database
- Fresh schema
- No data pollution between tests
- Automatic cleanup

## Coverage

### Run with Coverage
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest --cov=api --cov=models --cov=services --cov-report=html
```

### View Coverage Report
Open: `backend/htmlcov/index.html`

### Coverage Goals
- API endpoints: >80%
- Models: >90%
- Services: >70%
- Overall: >75%

## CI/CD Integration (Future)

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: cd backend && pytest
```

## Test Best Practices

### Writing New Tests

1. **Use fixtures** for common setup
2. **Test edge cases** (empty data, invalid input, errors)
3. **Keep tests isolated** (don't rely on other tests)
4. **Use descriptive names** (`test_create_todo_with_urgent_priority`)
5. **Test one thing** per test function
6. **Clean up** (fixtures handle this automatically)

### Example Test
```python
def test_create_todo_with_tags(client):
    """Test creating a todo with tags"""
    data = {
        "title": "Test Todo",
        "priority": "normal",
        "tags": ["test", "example"]
    }
    
    response = client.post("/api/todos/", json=data)
    assert response.status_code == 201
    
    result = response.json()
    assert result["tags"] == ["test", "example"]
```

## Running Specific Tests

### By File
```powershell
pytest tests/api/test_todos.py
```

### By Function
```powershell
pytest tests/api/test_todos.py::test_create_todo
```

### By Pattern
```powershell
pytest -k "todo"  # Run all tests with "todo" in name
```

### By Marker
```powershell
pytest -m asyncio  # Run all async tests
pytest -m slow     # Run slow tests only
```

## Debugging Tests

### Print Debug Info
```python
def test_something(client):
    response = client.post("/api/todos/", json=data)
    print(f"Response: {response.json()}")  # Will show in test output
    assert response.status_code == 201
```

### Run with Print Output
```powershell
pytest -v -s  # -s shows print statements
```

### Drop into Debugger on Failure
```powershell
pytest --pdb
```

## Test Database Location

Tests use temporary databases:
- Created in system temp directory
- Automatically deleted after test
- No interference with dev database (`vienna_life.db`)

## Frontend Tests (Future)

### Setup (Not Yet Implemented)
```powershell
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Run Frontend Tests
```powershell
cd frontend
npm test
```

## Continuous Testing

### Watch Mode (Re-run on File Changes)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest-watch  # Requires: pip install pytest-watch
```

## Test Data

### Mock Data Available
- Todos: Various priorities and categories
- Calendar Events: Different time ranges
- Shopping Offers: Spar and Billa sample products
- Austrian-specific data (Euro, German categories)

## Performance

### Test Execution Time
- All tests: ~5-10 seconds
- Individual test file: ~1-2 seconds
- Fast feedback loop for development

## Summary

✅ **35+ comprehensive tests**  
✅ **All API endpoints covered**  
✅ **Model validation tests**  
✅ **Service integration tests**  
✅ **Isolated test database**  
✅ **Easy to run** (`.\run-tests.ps1`)  
✅ **Coverage reports available**  

Run tests before committing changes to ensure quality!

---

**Quick Start**: `.\run-tests.ps1` from project root

