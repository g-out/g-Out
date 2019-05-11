function onClickLikeLocal(e) {
  e.preventDefault();

  const localId = e.target.dataset.localId;
  const heart = e.target


  // e.target.innerText = "Loading...";

  if (heart.classList.contains('black')) {
    console.log('entra')
    axios.post(`/local/${localId}/like`)
      .then((response) => {
        heart.parentNode.querySelector('p').innerText = `${response.data.likes} Likes`;
        heart.className = "fas fa-heart red"
      })
      .catch(console.log)
  } else {
    axios.post(`/local/${localId}/dislike`)
      .then((response) => {
        heart.parentNode.querySelector('p').innerText = `${response.data.likes} Likes`;        
        heart.className = "fas fa-heart black"
      })
      .catch(console.log)
  }
}