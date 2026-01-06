import { useState, useEffect, useMemo } from 'react'
import './App.css'
import type { Project, ProjectStatus } from './types'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    fetch('/projects.json')
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data)
        
        // Extract all unique tags
        const tags = new Set<string>()
        data.forEach((project) => {
          project.tags.forEach((tag) => tags.add(tag))
        })
        setAllTags(Array.from(tags).sort())
      })
      .catch((err) => console.error('Error loading projects:', err))
  }, [])

  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    // Filter by tag
    if (tagFilter !== 'all') {
      filtered = filtered.filter((project) => project.tags.includes(tagFilter))
    }

    return filtered
  }, [statusFilter, tagFilter, projects])

  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'wip':
        return 'status-wip'
      case 'archived':
        return 'status-archived'
      default:
        return ''
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Project Hub</h1>
        <p className="subtitle">A collection of my personal projects</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="wip">Work in Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="tag-filter">Tag:</label>
          <select
            id="tag-filter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="all">All</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <p className="no-projects">No projects found matching the selected filters.</p>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h2>{project.name}</h2>
                <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-links">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Repository
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <footer>
        <p>Built with React + Vite + TypeScript</p>
      </footer>
    </div>
  )
}

export default App
