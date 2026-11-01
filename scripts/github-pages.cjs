// Uses the existing Git credential helper; credentials stay in process memory.
const { execFileSync } = require('node:child_process');
const repo = 'BEKA2324/BEKACINEMA_3D';
(async () => {
  let credential;
  try {
    credential = execFileSync('git', ['-c', 'credential.interactive=never', 'credential', 'fill'], {
      input: `protocol=https\nhost=github.com\npath=${repo}.git\n\n`,
      encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' },
    });
  } catch { throw Error('GitHub credential helper is unavailable.'); }
  const token = credential.split('\n').find(line => line.startsWith('password='))?.slice(9);
  if (!token) throw Error('GitHub authentication is unavailable.');
  async function api(path, method = 'GET', body) {
    const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      method,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = response.status === 204 ? {} : await response.json();
    if (!response.ok && response.status !== 404) throw Error(`GitHub ${response.status}: ${data.message}`);
    return { status: response.status, data };
  }
  if (process.argv[2] === 'enable') {
    const current = await api('/pages');
    const result = current.status === 404 ? await api('/pages', 'POST', { build_type: 'workflow' }) : current.data.build_type !== 'workflow' ? await api('/pages', 'PUT', { build_type: 'workflow' }) : current;
    console.log(JSON.stringify({ status: result.status, url: result.data.html_url, build_type: result.data.build_type }));
  } else {
    const pages = await api('/pages');
    const runs = await api('/actions/workflows/pages.yml/runs?per_page=1');
    const run = runs.data.workflow_runs?.[0];
    console.log(JSON.stringify({ pages: { status: pages.status, url: pages.data.html_url, state: pages.data.status }, run: run && { id: run.id, status: run.status, conclusion: run.conclusion, url: run.html_url } }));
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
