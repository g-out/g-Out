function onClickLikeLocal(e) {
  e.preventDefault();

  const localId = e.target.dataset.localId;
  const heart = e.target


  // e.target.innerText = "Loading...";

  if (heart.classList.contains('black')) {
    console.log('entra')
    axios.post(`/local/${localId}/like`)
      .then((response) => {
        heart.parentNode.querySelector('p').innerText = `${response.data.countlikes} Likes`;
        heart.className = "fas fa-heart red"
        heart.parentNode.querySelector('p').className = "red"
      })
      .catch(console.log)
  } else {
    axios.post(`/local/${localId}/dislike`)
      .then((response) => {
        heart.parentNode.querySelector('p').innerText = `${response.data.countlikes} Likes`;        
        heart.className = "fas fa-heart black"
        heart.parentNode.querySelector('p').className = "black"
      })
      .catch(console.log)
  }
}