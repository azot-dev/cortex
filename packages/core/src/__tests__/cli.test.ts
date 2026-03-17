import { mkdtempSync, existsSync } from 'fs'
import os from 'os'
import path from 'path'
import { spawnSync } from 'child_process'

function runCli(args: string[], cwd: string) {
  const cliPath = path.resolve(__dirname, '../../scripts/cli.js')
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
  })
}

describe('CLI', () => {
  it('should generate react template into ./cortex', () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), 'cortex-cli-'))
    const res = runCli(['init', 'react'], cwd)

    expect(res.status).toBe(0)
    expect(res.stderr).toBe('')

    expect(existsSync(path.join(cwd, 'cortex/services/_services.ts'))).toBe(true)
    expect(existsSync(path.join(cwd, 'cortex/setup/setup.ts'))).toBe(true)
    expect(existsSync(path.join(cwd, 'cortex/dependencies/_dependencies.ts'))).toBe(true)
  })

  it('should fail with non-zero exit code for unknown library', () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), 'cortex-cli-'))
    const res = runCli(['init', 'nope'], cwd)

    expect(res.status).toBe(1)
    expect(res.stderr).toContain('is not recognized')
  })

  it('should fail with non-zero exit code when library is missing', () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), 'cortex-cli-'))
    const res = runCli(['init'], cwd)

    expect(res.status).toBe(1)
    expect(res.stderr).toContain('Missing "library"')
  })
})

