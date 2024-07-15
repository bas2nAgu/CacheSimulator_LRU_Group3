    
    function navigateToPost(url) {
        if(!event.target.classList.contains('up_vote') && !event.target.classList.contains('down_vote') && !event.target.classList.contains('delete-post-btn')) {
            window.location.href = url;
        }
      }
      function openForm() {
            
        document.getElementById("popup").style.display = "block";
      }
      
      function closeForm() {
        document.getElementById("popup").style.display = "none";
      }






      function handleDelete(event) {
        event.stopPropagation();
        openForm();
    }
    
    

