var processingMessage = 'Aguarde...';

function ExibirMensagemSucess(mensagem) {
    ExibirMensagemCustomizada('Sucesso', mensagem, null);
}

function ExibirMensagemErro(mensagem, funcaoCallback) {
    ExibirMensagemCustomizada('Erro', mensagem, funcaoCallback, 'error');
}

function ExibirMensagemCustomizada(cabecalho, mensagem, callbackFunction, type) {
    if (type === null || type === '') 
        type = 'success';
    
    swal({
        title: cabecalho,
        text: mensagem,
        type: type
    },
        callbackFunction);
}

//************************************************************************************************************
//************************************************************************************************************
function RegistrarEventoValidacaoCPF(nomeObjeto) {
    RegistrarMaskCPF(nomeObjeto);

    $("#" + nomeObjeto).change(function () {
        var objeto = $(this);
        var texto = objeto.val();

        if (texto != "") 
            var valid = ValidarCpf(texto);

        if (!valid) {
            swal({
                title: "",
                text: "CPF Inválido",
                type: "warning",
                confirmButtonClass: "btn-danger"
            });
            objeto.val("");
            objeto.focus();
        }
    });
}

function RegistrarEventoValidacaoCNPJ(nomeObjeto) {
    RegistrarMaskCNPJ(nomeObjeto);

    $("#" + nomeObjeto).bind('change', function () {
        var objeto = $(this);

        var texto = objeto.val().replace(/[^\d]+/g, '');
        if (texto != "") 
            var valid = ValidarCnpj(texto);

        if (!valid) {
            swal({
                title: "",
                text: "CNPJ Inválido",
                type: "warning",
                confirmButtonClass: "btn-danger"
            });
            objeto.val("");
            objeto.focus();
        }
    });
}

function RegistrarEventoValidacaoEmail(nomeObjeto) {
    $("#" + nomeObjeto).bind('change', function () {
        var objeto = $(this);
        var texto = objeto.val();

        if (texto != "") 
            var valid = ValidarEmail(texto);

        if (!valid) {
            swal({
                title: "",
                text: "Email Inválido",
                type: "warning",
                confirmButtonClass: "btn-danger"
            });
            objeto.val("");
            objeto.focus();
        }
    });
}

function RegistrarEventoValidacaoCEP(nomeObjeto, txtLogradouro, txtBairro, ddlUf, ddlMunicipio) {
    RegistrarMaskCEP(nomeObjeto)

    $('#' + nomeObjeto).change(function () {
        var objeto = $(this);

        var cep = objeto.val().replace(/\D/g, '');
        $.ajax({
            url: "https://viacep.com.br/ws/" + cep + "/json/",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                if (data.logradouro == undefined) {
                    swal({
                        title: "",
                        text: "CEP Inválido",
                        type: "warning",
                        confirmButtonClass: "btn-danger"
                    });
                } else {
                    var munid = data.ibge;

                    $("#" + txtLogradouro).val(data.logradouro);
                    $("#" + txtBairro).val(data.bairro);
                    //$("#cidade").val(data.localidade);
                    $("#" + ddlUf).val(data.ibge.substring(0, 2));

                    PreencherMunicipio(data.ibge.substring(0, 2), ddlMunicipio, munid);

                    $('#lbl' + ddlUf).val("");
                    $('#lblMun' + ddlMunicipio).val("");
                    $('#lblLogr' + txtLogradouro).val("");
                    $('#lblBairro' + txtBairro).val("");
                    $('#' + ddlMunicipio).attr("disabled", "disabled");
                    $('#' + ddlUf).attr("disabled", "disabled");
                }
            },
            error: function (e) {
                swal({
                    title: "",
                    text: "CEP Inválido",
                    type: "warning",
                    confirmButtonClass: "btn-danger"
                });
            }
        });
    });
}

function RegistrarEventoValidacaoData(nomeObjeto) {
    RegistrarMaskData(nomeObjeto)
}

function RegistrarEventoValidacaoHora(nomeObjeto) {
    RegistrarMaskHora(nomeObjeto)
}

function RegistrarEventosTestBox(nomeTextValidar, nomeLabelMensagem) {
    var callbBackFocus = function (e) {
        $('#' + nomeLabelMensagem).hide();
    };

    var callBackBlur = function (e) {
        if ($("#" + nomeTextValidar).val() == '') 
            ExibirMensagemAlerta(nomeLabelMensagem);
    };

    RegistrarEventosTestBoxCallbackCustom(nomeTextValidar, nomeLabelMensagem, callbBackFocus, callBackBlur);
}

function RegistrarEventosTestBoxCallbackCustom(nomeTextValidar, nomeLabelMensagem, callbBackFocus, callBackBlur) {
    $("#" + nomeTextValidar).bind('focus', callbBackFocus);
    $("#" + nomeTextValidar).bind('blur', callBackBlur);
}

//************************************************************************************************************
//************************************************************************************************************
function ValidarEmail(email) {
    var emailFilter = /^.+@.+\..{2,}$/;
    var illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]]/

    if (!(emailFilter.test(email)) || email.match(illegalChars)) 
        return false

    return true;
}

function ValidarCpf(cpf) {
    var cpf = cpf.replace(/[^0-9]/g, '').toString();

    if (cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" ||
        cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") 
        return false;
  
    if (cpf.length == 11) {
        var v = [];

        //Calcula o primeiro dígito de verificação.
        v[0] = 1 * cpf[0] + 2 * cpf[1] + 3 * cpf[2];
        v[0] += 4 * cpf[3] + 5 * cpf[4] + 6 * cpf[5];
        v[0] += 7 * cpf[6] + 8 * cpf[7] + 9 * cpf[8];
        v[0] = v[0] % 11;
        v[0] = v[0] % 10;

        //Calcula o segundo dígito de verificação.
        v[1] = 1 * cpf[1] + 2 * cpf[2] + 3 * cpf[3];
        v[1] += 4 * cpf[4] + 5 * cpf[5] + 6 * cpf[6];
        v[1] += 7 * cpf[7] + 8 * cpf[8] + 9 * v[0];
        v[1] = v[1] % 11;
        v[1] = v[1] % 10;

        //Retorna Verdadeiro se os dígitos de verificação são os esperados.
        if ((v[0] != cpf[9]) || (v[1] != cpf[10])) 
            return false;
    }
    else {
        return false;
    }

    return true;
}

function ValidarCnpj(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

function ValidarHora(valor) {
    var hrs = valor.substring(0, 2);
    var min = valor.substring(3, 5);

    if ((hrs < 00) || (hrs > 23) || (min < 00) || (min > 59)) 
        return false;

    return true;
}

function RegistrarMaskCPF(nomeObjeto) {
    $('#' + nomeObjeto).mask('000.000.000-00');
}

function RegistrarMaskCNPJ(nomeObjeto) {
    $('#' + nomeObjeto).mask('00.000.000/0000-00');
}

function RegistrarMaskCEP(nomeObjeto) {
    $('#' + nomeObjeto).mask('00000-000');
}

function RegistrarMaskData(nomeObjeto) {
    $('#' + nomeObjeto).mask('00/00/0000');
}

function RegistrarMaskHora(nomeObjeto) {
    $('#' + nomeObjeto).mask('00:00');
}

function RegistrarSomenteNumericos() {
    $(".numericOnly").bind('keypress', function (e) {
        var podeDigitar = false;
        var tecla = (window.event) ? event.keyCode : e.which;
        if ((tecla > 47 && tecla < 58)) {
            podeDigitar = true;
        }
        else {
            if (tecla == 8 || tecla == 0) 
                podeDigitar = true;
            else 
                podeDigitar = false;
        }
        if (!podeDigitar) 
            e.preventDefault();

        return podeDigitar;
    });

    $(".numericOnly").bind("paste", function (e) {
        e.preventDefault();
    });

    $(".numericOnly").bind('mouseenter', function (e) {
        var val = $(this).val();
        if (val != '0') {
            val = val.replace(/[^0-9]+/g, "")
            $(this).val(val);
        }
    });
}

function ValidarPIS(numeroPis) {
    var numPisSemMascara = numeroPis.replace(/[^\d]+/g, '');
    var multiplicadorBase = "3298765432";
    var total = 0;
    var resto = 0;
    var multiplicando = 0;
    var multiplicador = 0;
    var digito = 0;

    if (numPisSemMascara.length !== 11 ||
        numPisSemMascara === "00000000000" ||
        numPisSemMascara === "11111111111" ||
        numPisSemMascara === "22222222222" ||
        numPisSemMascara === "33333333333" ||
        numPisSemMascara === "44444444444" ||
        numPisSemMascara === "55555555555" ||
        numPisSemMascara === "66666666666" ||
        numPisSemMascara === "77777777777" ||
        numPisSemMascara === "88888888888" ||
        numPisSemMascara === "99999999999") {
        return false;
    } else {
        for (var i = 0; i < 10; i++) {
            multiplicando = parseInt(numPisSemMascara.substring(i, i + 1));
            multiplicador = parseInt(multiplicadorBase.substring(i, i + 1));
            total += multiplicando * multiplicador;
        }
        resto = 11 - total % 11;
        resto = resto === 10 || resto === 11 ? 0 : resto;
        digito = parseInt("" + numPisSemMascara.charAt(10));
        return resto === digito;
    }
}

function ValidarBancos(idBanco, agencia, digitoAgencia, conta, digitoConta, tipo_conta) {
    var bancoValido = true;
    $.ajax({
        url: "/Validations/ValidateBank",
        type: "GET",
        data: { agency: agencia, agencyDigit: digitoAgencia, account: conta, accountDigit: digitoConta, bankId: idBanco, accountType: tipo_conta},
        contentType: "application/json",
        async: false,
        success: function (data) {
            bancoValido = data;
            if (!data) {
                swal({
                    title: "",
                    text: "Informações bancárias em formato inválido",
                    type: "warning",
                    confirmButtonClass: "btn-danger"
                });
            }
        }
    });


    return bancoValido;
}

function RegistrarMascaraTelefone(nomeObjeto) {
    $("#" + nomeObjeto).bind('keypress', function (e) {
        var objeto = $(this);
        if (objeto.val() != '') {
            if (objeto.val().length == 1) {
                objeto.unmask();
                if (objeto.val().substring(0, 1) == '9') {
                    objeto.mask('00000-0000');
                    objeto.attr('maxlength', '10');
                }
                else {
                    objeto.mask('0000-0000');
                    objeto.attr('maxlength', '9');
                }
            }
        }
    });
    if ($("#" + nomeObjeto).val() != '') {
        var objeto = $("#" + nomeObjeto);
        objeto.unmask();
        if (objeto.val().substring(0, 1) == '9') {
            objeto.mask('00000-0000');
            objeto.attr('maxlength', '10');
        }
        else {
            objeto.mask('0000-0000');
            objeto.attr('maxlength', '9');
        }
    }
}

function PreencherMunicipio(idUf, ddlMunicipio, idMunicipio, inserirItemVazio) {
    if (inserirItemVazio == null) {
        inserirItemVazio = true;
    }
    $('#' + ddlMunicipio + ' option').remove();
    $.getJSON("/Validations/GetMunicipiosByUf", { uf_id: idUf })
        .done(function (data) {
            if (inserirItemVazio) {
                $('#' + ddlMunicipio).append('<option value="0">---  SELECIONE ---</option>');
            }

            for (var i = 0; i < data.length; i++) {
                $('#' + ddlMunicipio).append('<option value="' +
                    data[i].id + '"> ' +
                    data[i].nome + '</option>');
            }
            if (parseInt(idMunicipio) > 0) {
                $('#' + ddlMunicipio + ' option[value="' + idMunicipio + '"]').attr('selected', true)
            }
            else {
                $('#' + ddlMunicipio + ' option[value="0"]').attr('selected', true)
            }
        });
}

function RegistrarTooltipBootstrap() {
    $('[data-toggle="tooltip"]').tooltip();
}

function ExibirMensagemAlerta(nomeLabelMensagem) {
    $('#' + nomeLabelMensagem).attr("style", "display:block;");
}

function ExcluirDados(idValor, urlExclusao, functionCallBackDeleteSucess) {
    var functionCallback = function (response) {
        if (response == true) 
            ExibirMensagemCustomizada('Registro Excluído com Sucesso', '', functionCallBackDeleteSucess);
        else 
            ExibirMensagemCustomizada('Erro ao Excluir Registro', '', functionCallBackDeleteSucess);
    };

    swal({
        title: "Você tem certeza?",
        text: "Você tem certeza que gostaria de deletar o registro selecionado?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Sim",
        closeOnConfirm: false
    },
    function () {
        CallAjaxRequest(urlExclusao, { id: idValor }, 'DELETE', functionCallback); 
    });
}

function CallAjaxRequest(urlAjax, arrayParameters, requestType, customCallBackFunction) {
    $.ajax({
        url: urlAjax,
        type: requestType,
        data: arrayParameters,
        cache: false,
        success: customCallBackFunction,
        error: function (xhr, ajaxOptions, thrownError) {
            swal({
                title: "Erro ao processar requisição",
                text: "Ocorreu um erro ao processar a requisição.Contate o Suporte técnico",
                type: "error",
                confirmButtonClass: "btn-danger"
            });
        }
    });
}

function disabledButton(button) {
    button.html(processingMessage);
    button.prop('disabled', true);
}

function disableButtonAndShowLabel(button, label) {
    button.html(label);
    button.prop('disabled', true);
}

function enableButton(button, label) {
    button.html(label);
    button.prop('disabled', false);
}
