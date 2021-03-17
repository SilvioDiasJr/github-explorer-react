import { useEffect, useState } from "react";
import { RepositoryItem } from "./RepositoryItem";
import { FaGithub, FaSearch } from 'react-icons/fa'

import '../styles/repositories.scss'

interface Repository {
  name: string;
  description: string;
  html_url: string;
}

interface User {
  name: string;
  avatar_url: string;
  description: string;
  repos_url: string;
  bio: string;
}

export function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [user, setUser] = useState<Partial<User>>({})
  const [changeSelect, setChangeSelect] = useState('orgs')
  const [changeText, setChangeText] = useState('')
  const [isFetchError, setIsFetchError] = useState(false)
  const [page, setPage] = useState(1)

  function searchUsers() {
    if (changeText) {
      fetch(`https://api.github.com/${changeSelect}/${changeText}`)
        .then((response) => !response.ok ? setIsFetchError(true) : response.json())
        .then(data => setUser(data))
    }
    setPage(1)
    setIsFetchError(false)
    setUser({})
    setChangeText('')
  }

  useEffect(() => {
    if (user.repos_url) {
      fetch(`${user.repos_url}?page=${page}&per_page=5`)
        .then((response) => response.json())
        .then(data => setRepositories(data))
      setRepositories([])
    }
  }, [!isFetchError && user.repos_url, page])

  function handlePage(action: string) {
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  return (
    <div className="container">
      <header>
        <div className="title">
          <FaGithub className="icon" />
          <h1>Explorer GitHub</h1>
        </div>
        <div className="content-search">
          <label>
            Pesquise por seu usuário ou organização preferida para listar
            os repositórios
          </label>
          <div className="search">
            <select
              value={changeSelect}
              onChange={(e) => setChangeSelect(e.target.value)}
            >
              <option value="orgs">Org</option>
              <option value="users">Usuário</option>
            </select>

            <input
              type="text"
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
            />
            <button onClick={searchUsers}>
              <FaSearch />
            </button>
          </div>
        </div>
      </header>

      {isFetchError ?
        <span>Nenhum repositório encontrado!!</span>
        :
        <section className='content-info'>
          <>
            <div className="card-user">
              <div className="avatar-user">
                <img src={user.avatar_url} alt={user.name} />
              </div>
              <div className="description-user">
                <span>{user.name}</span>
                <p>{user.bio}</p>
                <p>{user.description}</p>
              </div>
            </div>

            <div className="repository-list">
              <h1>Lista de repositórios</h1>
              <div className="pagination-repositories">
                <button
                  type="button"
                  disabled={page < 2}
                  onClick={() => handlePage('back')}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  disabled={page > repositories.length }
                  onClick={() => handlePage('next')}
                >
                  Próxima
                </button>
              </div>
              <ul>
                {repositories.map(repository => (
                  <RepositoryItem
                    key={repository.name}
                    repository={repository}
                  />
                ))}
              </ul>
            </div>
          </>
        </section>
      }
    </div>
  )
}