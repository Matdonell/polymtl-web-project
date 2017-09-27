(function() {
    var snackbarContainer = document.querySelector('#toast');
    var refreshContainer = document.querySelector('#refresh');
    var showToastButton = document.querySelector('#show-toast');
    showToastButton.addEventListener('click', function() {
        var data = {message: 'Veuillez rafraîchir la page pour mettre à jour les données sur le jeu '};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
    refreshContainer.addEventListener('click', function() {
        window.location.reload(true);
    });
}());