# Structure: T-001-06 Deployment Config

## Files Created

### frontend/public/_redirects
`/* /index.html 200`

### frontend/wrangler.toml
Cloudflare Pages config for CLI deploy

### backend/Procfile
Railway process type definition

### backend/railway.toml
Railway build/deploy config with healthcheck

## Files Modified

### README.md
Add complete Deploy section with Railway + CF Pages steps

## Files Not Modified

- All application code untouched
- `backend/requirements.txt` — already complete
- `frontend/package.json` — build script already correct
