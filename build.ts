import solidPlugin from "@opentui/solid/bun-plugin";
import { existsSync, mkdirSync } from "fs";

const RELEASES_DIR = "./dist/releases";

// Supported compilation targets
type CompileTarget =
  | "bun-darwin-arm64"
  | "bun-darwin-x64"
  | "bun-linux-x64"
  | "bun-linux-arm64";

async function bundle() {
  console.log("📦 Bundling kilotail CLI...");

  const result = await Bun.build({
    entrypoints: ["./bin/kilotail.ts"],
    outdir: "./dist",
    target: "bun",
    conditions: ["browser"],
    plugins: [solidPlugin],
    minify: true,
    sourcemap: "linked",
  });

  if (!result.success) {
    console.error("❌ Bundle failed:");
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  console.log(`✅ Bundled to dist/kilotail.js (${result.outputs.length} files)`);
  return result;
}

async function compile(target: CompileTarget, bundlePath: string) {
  const isWindows = target.includes("windows");
  const ext = isWindows ? ".exe" : "";
  const outputName = `kilotail-${target.replace("bun-", "")}${ext}`;
  const outputPath = `${RELEASES_DIR}/${outputName}`;

  console.log(`🔨 Compiling for ${target}...`);

  const result = await Bun.build({
    entrypoints: [bundlePath],
    compile: {
      target,
      outfile: outputPath,
      autoloadBunfig: false,
      autoloadTsconfig: false,
      autoloadPackageJson: false,
    },
    minify: true,
  });

  if (!result.success) {
    console.error(`❌ Compile failed for ${target}:`);
    for (const log of result.logs) {
      console.error(log);
    }
    return false;
  }

  console.log(`✅ Compiled: ${outputPath}`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "bundle";

  // Ensure dist directories exist
  if (!existsSync("./dist")) {
    mkdirSync("./dist", { recursive: true });
  }
  if (!existsSync(RELEASES_DIR)) {
    mkdirSync(RELEASES_DIR, { recursive: true });
  }

  switch (command) {
    case "bundle": {
      await bundle();
      break;
    }

    case "compile": {
      const bundlePath = "./dist/kilotail.js";
      if (!existsSync(bundlePath)) {
        console.log("📦 Bundle not found, bundling first...");
        await bundle();
      }

      // Compile only for current platform (native build)
      const platform = process.platform;
      const arch = process.arch;
      
      let target: CompileTarget | null = null;
      
      if (platform === "darwin") {
        if (arch === "arm64") {
          target = "bun-darwin-arm64";
        } else if (arch === "x64") {
          target = "bun-darwin-x64";
        }
      } else if (platform === "linux") {
        if (arch === "x64") {
          target = "bun-linux-x64";
        } else if (arch === "arm64") {
          target = "bun-linux-arm64";
        }
      }

      if (!target) {
        console.error(`❌ Unsupported platform: ${platform} ${arch}`);
        process.exit(1);
      }

      const success = await compile(target, bundlePath);
      if (!success) {
        console.error(`❌ Failed to compile for ${target}`);
        process.exit(1);
      }

      break;
    }

    default: {
      console.log("Usage: bun run build.ts [bundle|compile]");
      console.log("");
      console.log("Commands:");
      console.log("  bundle   - Bundle to dist/kilotail.js");
      console.log("  compile  - Compile for current platform");
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
