# ─── Cloudflare Configuration Guide ─────────────────────────────────────────

# Citywide Waste Solutions

# Setup these rules in your Cloudflare dashboard

# ─── DNS Records ─────────────────────────────────────────────────────────────

# A @ → Vercel IP (auto-assigned via Vercel dashboard)

# CNAME www → cname.vercel-dns.com

# CNAME \_vercel → cname.vercel-dns.com

# MX @ → mail provider records

# TXT @ → SPF, DKIM records for email deliverability

# ─── SSL / TLS ───────────────────────────────────────────────────────────────

# Mode: Full (Strict)

# Always Use HTTPS: ON

# HSTS: max-age=63072000, includeSubDomains, preload

# Min TLS Version: TLS 1.2

# TLS 1.3: ON

# Automatic HTTPS Rewrites: ON

# ─── Cache Rules (Cloudflare Cache Rules) ────────────────────────────────────

# Rule 1: Cache static assets indefinitely

# Match: (http.request.uri.path matches "^\/\_next\/static\/.\*")

# Action: Cache Everything

# Edge Cache TTL: 1 year

# Browser Cache TTL: 1 year

# Rule 2: Cache public images

# Match: (http.request.uri.path matches "^\/images\/.\*")

# Action: Cache Everything

# Edge Cache TTL: 1 month

# Browser Cache TTL: 1 week

# Rule 3: Cache blog posts (ISR-aware)

# Match: (http.request.uri.path matches "^\/blog\/")

# AND (http.request.method eq "GET")

# Action: Cache Everything

# Edge Cache TTL: 1 hour

# Respect origin Cache-Control: ON

# Rule 4: Bypass cache for API routes

# Match: (http.request.uri.path matches "^\/api\/")

# Action: Bypass Cache

# Rule 5: Bypass cache for admin

# Match: (http.request.uri.path matches "^\/admin\/")

# OR (http.request.uri.path matches "^\/studio\/")

# Action: Bypass Cache

# ─── Security Rules (WAF) ────────────────────────────────────────────────────

# Rule 1: Block suspicious bots

# Expression: (cf.client.bot) AND NOT (cf.verified_bot_category in {"Search Engine Crawler" "Monitoring & Analytics"})

# Action: Challenge

# Rule 2: Rate limit API

# Expression: (http.request.uri.path matches "^\/api\/") AND (http.request.method eq "POST")

# Rate: 20 requests per 1 minute per IP

# Action: Block (429)

# Rule 3: Protect admin routes

# Expression: (http.request.uri.path matches "^\/admin\/")

# Action: Challenge (Managed Challenge)

# ─── Speed (Optimization) ────────────────────────────────────────────────────

# Auto Minify: HTML, CSS, JS = ON

# Brotli: ON

# Early Hints: ON

# HTTP/2: ON

# HTTP/3 (QUIC): ON

# 0-RTT Connection Resumption: ON

# Rocket Loader: OFF (Next.js handles JS loading)

# Mirage (image optimization): OFF (next/image handles this)

# ─── Network ─────────────────────────────────────────────────────────────────

# WebSockets: OFF (not needed)

# Pseudo IPv4: OFF

# IP Geolocation: ON (for Canadian targeting)

# Max Upload Size: 100 MB

# ─── Page Rules ──────────────────────────────────────────────────────────────

# (Use Cache Rules above — Page Rules are being deprecated)

# ─── Workers (optional — for edge redirects) ─────────────────────────────────

# Deploy a Cloudflare Worker for:

# - www → non-www redirect

# - Geo-targeted content (Ontario-specific messaging)

# - A/B testing quote form variants

# ─── Analytics ───────────────────────────────────────────────────────────────

# Cloudflare Web Analytics: Enable (privacy-first, no cookies)

# Add beacon to layout.tsx:

# <script defer src='https://static.cloudflareinsights.com/beacon.min.js'

# data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
