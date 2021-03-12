import { useEffect, useState } from "react";
import { RepositoryItem } from "./RepositoryItem";
import { FaSearch } from 'react-icons/fa'

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
    fetch(`${user.repos_url}?page=${page}&per_page=5`)
      .then((response) => response.json())
      .then(data => setRepositories(data))
    setRepositories([])
  }, [!isFetchError && user.repos_url, page])

  function handlePage(action: string){
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  return (
    <div className="container">
      <header>
        <div className="content-search">
          <select
            value={changeSelect}
            onChange={(e) => setChangeSelect(e.target.value)}
          >
            <option value="orgs">Orgs</option>
            <option value="users">Users</option>
          </select>

          <input
            type="text"
            value={changeText}
            onChange={(e) => setChangeText(e.target.value)}
          />
          <button onClick={searchUsers}>
            <FaSearch />
            <span>Buscar</span>
          </button>
        </div>
      </header>

      <section className='repository-list'>
        {isFetchError ?
          <span>Nenhum repositório encontrado!!</span>
          :
          <>
            <div className="card-usuer">
              <div className="info-user">
                <img src={user.avatar_url} alt={user.name} />
                <span>{user.name}</span>
              </div>
              <div className="description-user">
                {changeSelect === 'users' ?
                  <>
                    <h1>Bio</h1>
                    <p>{user.bio}</p>
                  </>
                  :
                  <>
                    <h1>Descrição</h1>
                    <p>{user.description}</p>
                  </>
                }
              </div>
            </div>

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
                  disabled={page > repositories.length}
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
          </>
        }
      </section>
    </div>
  )
}