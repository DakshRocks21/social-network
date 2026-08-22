import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import Post from './Post'
import { config } from '../../config'
import { useApi } from '../../utils/api'

function Posts({ author }) {
  const [posts, setPosts] = useState([])
  const apiRequest = useApi()

  useEffect(() => {
    void (async () => {
      const userIdFilter = author === undefined ? '' : `userId=${author.id}`
      const res = await apiRequest(config.backendUrl + '/post?' + userIdFilter);
      if (res.ok) {
        const postsData = await res.json()
        setPosts(postsData)
      }

    })()

    return () => {
      setPosts([])
    }
  }, [author])

  // Posts are ordered by id in descending order
  const orderedPosts = posts.sort((a, b) => {
    return b.id - a.id;
  });

  return (
    <Container sx={{ pt: '16px' }}>
      {orderedPosts.map((post) => ( 
        <Post key={post.id} post={post} author={author} />
      ))}
    </Container>
  )
}

export default Posts
