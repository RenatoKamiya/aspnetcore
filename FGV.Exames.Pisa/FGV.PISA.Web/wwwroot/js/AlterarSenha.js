$(document).ready(function () {
    var txtSenha = $('#txt_senha');
    var txtConfirmSenha = $('#txt_confirmacao_senha');
    var idU = $('#idU');
    var divBarSenhaForca = $('#senhaForca');
    var btnAlterarSenha = $('#btnAlterarSenha');
    var spanSenhaMsg = $('#senhaMsg');

    var PoliticasSenhaValida = false;
    var SenhasIguais = false;

    btnAlterarSenha.click(function () {
        if (txtSenha.val() != txtConfirmSenha.val()) {
            swal("Senhas diferentes", "As senhas digitadas são diferentes.", "error");
        } else {
            btnAlterarSenha.html('Aguarde...');
            btnAlterarSenha.prop('disabled', true);

            $.post("/login/AlterarSenhaById", { 'usuarioId': idU.val(), 'senha': txtSenha.val() })
                    .done(function (data) {
                        if (data.id != 0) {
                            $('#modalAterarSenha').modal('hide');
                            swal({
                                title: "Senha alterada",
                                text: "Senha alterada com sucesso.",
                                type: "success"
                            },
                                function () {
                                    window.location = (idU.val() === undefined) ? "home" : "index";
                                }
                            );
                            btnAlterarSenha.html('Alterar senha');
                        }
                        else {
                            $('#modalAterarSenha').modal('hide');
                            swal("Não foi possível alterar a senha!", data.mensagem, "error");
                            btnAlterarSenha.html('Alterar senha');
                            btnAlterarSenha.prop('disabled', false);

                        }
                    })
                    .fail(function (result) {
                        var x = JSON.parse(result.responseText);
                        $('#modalAterarSenha').modal('hide');
                        swal("Erro ao alterar senha do colaborador!", x.mensagem, "error");
                        btnAlterarSenha.html('Alterar senha');
                        btnAlterarSenha.prop('disabled', false);
                    });
            }
    });

    $(function () {
        txtSenha.keyup(function (e) {
            var senha = $(this).val();

            if (senha === '') {
                $('#senhaBarra').hide();
                spanSenhaMsg.html('');
                btnAlterarSenha.prop('disabled', true);
            } else {
                var fSenha = forcaSenha(senha);
                var texto = "";
                PoliticasSenhaValida = false;

                divBarSenhaForca.css('width', fSenha + '%');
                divBarSenhaForca.removeClass();
                divBarSenhaForca.addClass('progress-bar');

                if (fSenha <= 40) {
                    texto = 'Fraca';
                    divBarSenhaForca.addClass('progress-bar-danger');
                }

                if (fSenha > 40 && fSenha <= 70) {
                    texto = 'Media';
                    divBarSenhaForca.addClass('progress-bar-success');
                }

                if (fSenha > 70 && fSenha < 100) {
                    texto = 'Boa';
                    divBarSenhaForca.addClass('progress-bar-success');
                }

                if (fSenha >= 100) {
                    texto = 'Muito boa';
                    divBarSenhaForca.addClass('progress-bar-success');
                    PoliticasSenhaValida = true;
                }

                validarSenha();

                divBarSenhaForca.text(texto);
                $('#senhaBarra').show();
            }
        });

        txtConfirmSenha.keyup(function () {
            validarSenha();
        });
    });

    function validarSenha() {
        SenhasIguais = (txtSenha.val() === txtConfirmSenha.val()) ? true : false;
        var txtMensagem, txtFormatColor = "";
        var isDisabledBotton = false;

        if (PoliticasSenhaValida && SenhasIguais) {
            txtMensagem = "- A senha cumpre com as políticas. <br>- A senha e confirmacão da senha são iguais.";
            txtFormatColor = "color:#a0a9b4";
            isDisabledBotton = false;
        } else if (PoliticasSenhaValida && !SenhasIguais) {
            txtMensagem = "- A senha e a confirmacão da senha são diferentes.";
            txtFormatColor = "color:red";
            isDisabledBotton = true;
        } else if (!PoliticasSenhaValida && SenhasIguais) {
            txtMensagem = "- A senha não cumpre com as políticas abaixo.";
            txtFormatColor = "color:red";
            isDisabledBotton = true;
        } else if (!PoliticasSenhaValida && !SenhasIguais) {
            txtMensagem = "- A senha não cumpre com as politicas abaixo. <br>- A senha e a confirmacão da senha são diferentes";
            txtFormatColor = "color:red";
            isDisabledBotton = true;
        }

        spanSenhaMsg.html(txtMensagem);
        spanSenhaMsg.prop('style', txtFormatColor);
        btnAlterarSenha.prop("disabled", isDisabledBotton);
    }


    function forcaSenha(senha) {
        var forca = 0;

        var regLetrasMaiusculas = /[A-Z]/;
        var regLetrasMinusculas = /[a-z]/;
        var regNumero = /[0-9]/;
        var regEspecial = /[!@@#$%&*?]/;

        var tamanhoMinimo, tamanhoMaximo, letrasMaiusculas, letrasMinusculas, numero, especial = false;

        if (senha.length >= 6) tamanhoMinimo = true;
        if (senha.length <= 16) tamanhoMaximo = true;
        if (regLetrasMaiusculas.exec(senha)) letrasMaiusculas = true;
        if (regLetrasMinusculas.exec(senha)) letrasMinusculas = true;
        if (regNumero.exec(senha)) numero = true;
        if (regEspecial.exec(senha)) especial = true;

        if (tamanhoMinimo) forca += 20;
        if (tamanhoMaximo) forca += 20;
        if (letrasMaiusculas) forca += 10;
        if (letrasMinusculas) forca += 10;
        if (numero) forca += 20;
        if (especial) forca += 20;

        return forca;
    }
});