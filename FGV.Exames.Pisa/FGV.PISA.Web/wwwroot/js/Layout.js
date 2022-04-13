$(document).ready(function () {
    $('#alterarSenha').click(function () {
        $('#modalAterarSenha').modal('show');
    });

    $('#btnCancelarAlterarSenha').click(function () {
        $('#txt_senha').val('');
        $('#txt_confirmacao_senha').val('');
        $('#senhaForca').text('');
        $('#senhaMsg').text('');
        $('#btnAlterarSenha').prop("disabled", true);
        $('#modalAterarSenha').modal('hide');
    });

    $('.logout').click(function () {
        localStorage.clear();
        window.location = "/Login/Logout";
    });
});