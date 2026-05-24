const cacheKey = "wxn/main/data";
const ttl = 60 * 60 * 1000; // hour

interface Repo {
    name: string;
    html_url: string;
    description?: string;
}

export function loadRepos() {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < ttl) return renderRepos(data.data);
        else localStorage.removeItem(cacheKey);
    }

    getRepos().then(repos => {
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: repos
        }));
        renderRepos(repos);
    });
}

export async function getRepos(): Promise<Repo[]> {
    let page = 1;
    const all: Repo[] = [];

    while (true) {
        const res = await fetch(`https://api.github.com/users/wxn0brP/repos?per_page=100&page=${page}`);

        const data: Repo[] = await res.json();
        if (data.length === 0) break;

        all.push(...data);
        page++;
    }

    return all;
}

export function renderProjectRepos(repos: Repo[], prefix: string, npm: string) {
    const filtered = repos.filter(r => r.name.startsWith(prefix + "-"));

    filtered.push({
        name: "NPM package",
        html_url: `https://www.npmjs.com/package/${npm}`
    });

    return filtered
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(r =>
            `<a href="${r.html_url}" target="_blank">${r.name.replace(prefix + "-", "")}</a>`
        ).join("\n");
}

function renderRepos(repos: Repo[]) {
    function render(qs: string, prefix: string, npm: string) {
        document.querySelector(qs).innerHTML = renderProjectRepos(repos, prefix, npm);
    }

    render("#valtheradb-links", "ValtheraDB", "@wxn0brp/db");
    render("#vql-links", "VQL", "@wxn0brp/vql");
}
