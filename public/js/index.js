function onClickLikeLocal(e) {
    e.preventDefault();
  
    const localId = e.target.dataset.localId;
  
    e.target.innerText = "Loading..."
  
    axios.post(`/local/${localId}/like`)
      .then((response) => {
        e.target.innerText = `${response.data.likes} Likes`;
      })
      .catch(console.log)
  }