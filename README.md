# KiloTail

KiloTail is a terminal wizard that connects Tailscale + Kilo and publishes Kilo to your tailnet with a shareable URL and QR code.

## Quick Install

Prerequisites: `tailscale` and `kilo` installed and available on your PATH.

### Homebrew (recommended)

```bash
brew tap jeanduplessis/tap
brew install kilotail
kilotail
```

### Bunx (no global install)

```bash
bunx @jeanduplessis/kilotail
```

### Direct binary

Download the latest binary from [GitHub Releases](https://github.com/jeanduplessis/kilotail/releases/latest), mark it executable, then run it:

```bash
chmod +x ./kilotail
./kilotail
```

## How It Works

- KiloTail checks that `tailscale` and `kilo` are installed
- If Tailscale is not connected, it prompts you to sign in (including QR-based flows from Tailscale)
- It starts Kilo locally only (`127.0.0.1`, default port `4096`)
- It runs `tailscale serve` so the app is reachable from devices on your tailnet
- It keeps the process alive until you quit, then cleans up the local server process

## Install Prerequisites

1. Install Tailscale

- macOS: `brew install --cask tailscale-app`
- Windows: `winget install --id tailscale.tailscale --exact`
- Linux: `curl -fsSL https://tailscale.com/install.sh | sh`

Then sign in and make sure Tailscale is running on this machine.

2. Install Kilo CLI

- All platforms: `npm install -g @kilocode/cli`
- Alternative: `bun install -g @kilocode/cli`

Verify both commands work:

```bash
tailscale version
kilo --version
```

## Run KiloTail

### Option 1: Binary Releases (Recommended)

Download pre-built binaries from [GitHub Releases](https://github.com/jeanduplessis/kilotail/releases):

```bash
# macOS (Apple Silicon)
curl -L -o kilotail https://github.com/jeanduplessis/kilotail/releases/latest/download/kilotail-darwin-arm64
chmod +x kilotail
./kilotail

# macOS (Intel)
curl -L -o kilotail https://github.com/jeanduplessis/kilotail/releases/latest/download/kilotail-darwin-x64
chmod +x kilotail
./kilotail

# Linux (x64)
curl -L -o kilotail https://github.com/jeanduplessis/kilotail/releases/latest/download/kilotail-linux-x64
chmod +x kilotail
./kilotail

# Linux (ARM64)
curl -L -o kilotail https://github.com/jeanduplessis/kilotail/releases/latest/download/kilotail-linux-arm64
chmod +x kilotail
./kilotail
```

### Option 2: Via Bun (requires Bun runtime)

Requires Bun (the `kilotail` executable is a Bun CLI):

```bash
curl -fsSL https://bun.sh/install | bash
```

Run without installing globally:

```bash
bunx @jeanduplessis/kilotail
```

Or install globally:

```bash
bun add -g @jeanduplessis/kilotail
kilotail
```

### Option 3: Run from Source

```bash
bun install
bun run start
```

For development (hot reload):

```bash
bun run dev
```

## Optional Configuration

- `KILOTAIL_PORT` (default: `4096`)
- `KILOTAIL_PASSWORD` (optional; passed as `OPENCODE_SERVER_PASSWORD`)

Example:

```bash
KILOTAIL_PORT=4096 KILOTAIL_PASSWORD=secret bun run start
```

## Usage Notes

- The published URL is only reachable from devices on your Tailscale tailnet
- Kilo is bound to localhost to avoid exposing it on your LAN
- `kilotail` always opens the setup wizard (use `kilotail --attach` for explicit attach)
- KiloTail shows a local attach command after setup: `kilo attach http://127.0.0.1:4096`

## Binary Releases

We provide standalone binaries for:

- **macOS**: `arm64` (Apple Silicon), `x64` (Intel)
- **Linux**: `x64`, `arm64`
- **Windows**: `x64` (coming soon)

Binaries are compiled with Bun and include the Bun runtime. No separate Bun installation needed.

### Verification

All releases include SHA256 checksums in `SHA256SUMS`. Verify after download:

```bash
# macOS/Linux
sha256sum -c SHA256SUMS
```

## Development

### Building Locally

```bash
# Bundle for local testing
bun run build:bundle

# Compile for current platform
bun run build:compile

# Full release build (all platforms + checksums)
bun run build:release
```

### Scripts

- `bun run typecheck` - Type check with TypeScript
- `bun run lint` - Lint with oxlint
- `bun run fmt` - Format with oxfmt
- `bun run check` - Run all checks (typecheck + lint + fmt)

## License

MIT
