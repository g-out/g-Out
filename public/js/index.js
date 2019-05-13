function onClickLikeLocal(e) {
  e.preventDefault();

  const localId = e.target.dataset.localId;
  const heart = e.target

  if (heart.classList.contains('black')) {
    axios.post(`/local/${localId}/like`)
      .then((response) => {
        heart.parentNode.querySelector('span').innerText = `${response.data.countlikes} Likes`;
        heart.className = "fas fa-heart w-25 p-1 red"
      })
      .catch(console.log)
  } else {
    axios.post(`/local/${localId}/dislike`)
      .then((response) => {
        heart.parentNode.querySelector('span').innerText = `${response.data.countlikes} Likes`;        
        heart.className = "fas fa-heart w-25 p-1 black"
      })
      .catch(console.log)
  }
}