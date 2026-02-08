from fastapi import FastAPI

app = FastAPI(title='Seismic Monitor API', version='1.0.0')


@app.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'seismic-monitor'}
