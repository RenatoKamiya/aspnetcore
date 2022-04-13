localStorage.clear();
var infoUser = null;
var processingMessage = 'Aguarde...';
var lblValidaCPF = 'Validar CPF';
var lblRecuperarSenha = 'Redefinir Senha';
var lblSalvarNovoEmail = 'Salvar novo email';
var perfilAtivoDeInscricoes = '';

$(document).ready(function () {   

    var btnVoltar = $('#back-btn');
    var btnValidaCPF = $('#btn_valida_cpf');
    var btnAtualizaEmail = $('#btn_atualiza_email');
    var btnValidaDadoUser = $('#btn_valida_dada_user');
    var btnSalvarNewEmail = $('#btn_salvar_new_email');
    var btnRecuperarSenha = $('#btn_recuperar_senha');
    var txtCpfValidate = $('#txt_cpf_validate');

    $('#txt_cpf').mask('000.000.000-00');  

    var spanMessageRecoveryPassword = $('#span_message_recovery_password');

    btnVoltar.click(() => {
        setInitialState();
    });

    btnValidaCPF.click(function () {
        var cpf = txtCpfValidate.val().replace(".", "").replace(".", "").replace("-", "");
        disabledButton(btnValidaCPF);

        $.get("/login/ValidarUsuarioByCPF", { 'cpf': cpf })
            .done(function (data) {
                infoUser = data

                var infoEmail = "Você tem cadastrado o seguinte email: " + "<strong>" + data.email + "</strong> <br><br>" +
                    "- Caso seu e-mail esteja correto, clique em <strong>Redefinir Senha</strong><br>" +
                    "- Caso deseje atualizar seu e-mail, clique em <strong>Atualizar E-mail</strong><br>";

                spanMessageRecoveryPassword.html(infoEmail);
                spanMessageRecoveryPassword.prop('style', "color:#a0a9b4");
                spanMessageRecoveryPassword.show();

                enabledButton(btnValidaCPF, lblValidaCPF)
                btnValidaCPF.hide();
                btnAtualizaEmail.show();
                btnRecuperarSenha.show();
            })
            .fail(function (result) {
                infoUser = null;

                var response = JSON.parse(result.responseText);
                spanMessageRecoveryPassword.html(response.mensagem);
                spanMessageRecoveryPassword.prop('style', "color:red");
                spanMessageRecoveryPassword.show();

                enabledButton(btnValidaCPF, lblValidaCPF);
                btnValidaCPF.hide();
            });
    });

    btnRecuperarSenha.click(() => {
        disabledButton(btnRecuperarSenha);

        $.get("/login/RecuperarSenha", { 'usuarioId': infoUser.idUsuario, 'email': infoUser.email, 'nome': infoUser.nome })
            .done(function (data) {
                spanMessageRecoveryPassword.prop('style', "color:#a0a9b4").append("<p><strong>" + data.response + "</strong></p>");
                enabledButton(btnRecuperarSenha, lblRecuperarSenha);
                btnRecuperarSenha.hide();
                btnAtualizaEmail.hide();
            })
            .fail(function (result) {
                var response = JSON.parse(result.responseText);
                spanMessageRecoveryPassword.prop('style', "color:#a0a9b4").append("<p style='color:red'>" + response.mensagem + "</p>");
                enabledButton(btnRecuperarSenha, lblRecuperarSenha)
                btnRecuperarSenha.hide();
                btnAtualizaEmail.hide();
            });
    })

    btnAtualizaEmail.click(() => {
        spanMessageRecoveryPassword.append(
            "<div><p><strong>Antes de atualizar seu e-mail, primeiro precisamos validar algumas informações:</strong></p></div>" +
            "<div class='row' style='margin-top: -30px;'>" +
            "<div class='col-xs-6'><p>Insira RG: <input class='form-control placeholder-no-fix' type='text' id='txtRG' maxlength='15'  /></p></div>" +
            "<div class='col-xs-6'><p>Insira data nascimento: <input class='form-control placeholder-no-fix' type='text' id='txtDataNascimento' placeholder='DD/MM/AAAA' /></p></div>" +
            "<div class='col-xs-12' style='margin-top: -30px;'><p>Insira nome da mãe: <input class='form-control placeholder-no-fix' type='text' id='txtNomeMae' /></p></div>" +
            "</div>"
        );

        $('#txtDataNascimento').mask('00/00/0000');
        btnRecuperarSenha.hide();
        btnAtualizaEmail.hide();
        btnValidaDadoUser.show();
    });

    btnValidaDadoUser.click(() => {
        var txtRG = $('#txtRG').val().trim();
        var txtDataNascimento = $('#txtDataNascimento');
        var txtNomeMae = $('#txtNomeMae').val().trim().toUpperCase();

        var arrayData = txtDataNascimento.val().trim().split('/');
        var txtDataNascimentoFormatAAAAMMDD = arrayData[2] + '-' + arrayData[1] + '-' + arrayData[0];
        var userDataNascimentoFormatAAAMMDD = infoUser.dataNascimento.split('T')[0];

        var isUserValid = (txtRG === infoUser.rg
            && txtDataNascimentoFormatAAAAMMDD === userDataNascimentoFormatAAAMMDD
            && txtNomeMae === infoUser.nomeMae.toUpperCase()) ? true : false;

        var resultToValidation = "";
        if (isUserValid) {
            resultToValidation = "<p>Os dados são <strong>válidos</strong>. Você pode atualizar seu email.</p>" +
                "<div><p>Insira seu novo e-mail: <input class='form-control placeholder-no-fix' type='email' id='txtNovoEmail' placeholder='Novo e-mail' oncopy='return false' /></p></div>" +
                "<div><p>Confirme seu email: <input class='form-control placeholder-no-fix' type='email' id='txtNovoEmailConfirmacao' placeholder='Confirme seu e-mail' oncopy='return false' /></p></div>" +
                "<span id='msgValidacaoEmail' style='display:none; color:red'>- Formato do email não é válido ou e-mails inseridos são diferentes.</span>";

            btnValidaDadoUser.hide();
            btnSalvarNewEmail.show();
        }
        else {
            resultToValidation = "<p style='color:red'>Os dados são<strong> inválidos.</strong> Não foi possível alterar seu e-mail.</p><br>";
            btnValidaDadoUser.hide();
        }

        spanMessageRecoveryPassword.html(resultToValidation);
    });

    btnSalvarNewEmail.click(function () {
        disabledButton(btnSalvarNewEmail);
        var emailIsValid = isValidEmail($("#txtNovoEmail").val());
        var emailsAreEquals = ($("#txtNovoEmail").val() === $("#txtNovoEmailConfirmacao").val()) ? true : false;

        if (emailIsValid && emailsAreEquals) {
            $("#msgValidacaoEmail").hide();
            $.get("/login/ConfirmarEmail", { 'usuarioId': infoUser.idUsuario, 'newEmail': $('#txtNovoEmail').val(), 'nome': infoUser.nome })
                .done(function (data) {
                    spanMessageRecoveryPassword.prop('style', "color:#a0a9b4").append("<p><strong>" + data.response + "</strong></p>");
                    enabledButton(btnSalvarNewEmail, lblSalvarNovoEmail);
                    btnSalvarNewEmail.hide();
                })
                .fail(function (result) {
                    var response = JSON.parse(result.responseText);
                    spanMessageRecoveryPassword.prop('style', "color:#a0a9b4").append("<p style='color:red'>" + response.mensagem + "</p>");
                    enabledButton(btnSalvarNewEmail, lblSalvarNovoEmail);
                    btnSalvarNewEmail.hide();
                });

        } else {
            $("#msgValidacaoEmail").show();
            enabledButton(btnSalvarNewEmail, lblSalvarNovoEmail);
        }
    });

    function isValidEmail(email) {
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email) ? true : false;
    }


    if (perfilAtivoDeInscricoes === perfilRestrito || perfilAtivoDeInscricoes === perfilPublico)
        $("#acessoConvidado").css({ display: "" });
    else
        $("#acessoConvidado").css({ display: "none" });

    //$('#btnAcessoConvidado').click(function () {
    //    $('#convidado').show();
    //});

    $('#btnCadastrarConvidado').click(function () {
        event.preventDefault();
        var _cpf = $('#CpfConvidado').val();
        if (_cpf != '' && validaCpf(_cpf)) {
            var url = $(this).attr('href');
            url = url.replace("CPFCOLABORADOR", _cpf);
            location.href = url;
        }
        else {
            swal("CPF inválido", "CPF inválido", "error");
        }
        return false;
    });

    $('#btnVoltarModalAtendimento').click(function () {
        $('#atendimento').modal('hide');
    });
    var url = window.location.href;
    $('#URL').val(url);


    function setInitialState() {
        infoUser = null;
        btnValidaCPF.show();

        btnAtualizaEmail.hide();
        btnValidaDadoUser.hide();
        btnSalvarNewEmail.hide();
        btnRecuperarSenha.hide();

        enabledButton(btnValidaCPF, lblValidaCPF);
        enabledButton(btnRecuperarSenha, lblRecuperarSenha);
        enabledButton(btnSalvarNewEmail, lblSalvarNovoEmail);

        txtCpfValidate.val('');

        spanMessageRecoveryPassword.hide();
    }
});

function disabledButton(button) {
    button.html(processingMessage);
    button.prop('disabled', true);
}

function enabledButton(button, label) {
    button.html(label);
    button.prop('disabled', false);
}

function OpenModalAtendimento() {
    $('#atendimento').modal('show');
}

function validaCpf(cpf) {
    cpf = cpf.replace('.', '').replace('.', '').replace('-', '');
    if (cpf === '') return false;
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999")
        return false;
    // Valida 1o digito 
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito 
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(cpf.charAt(10)))
        return false;
    return true;
}