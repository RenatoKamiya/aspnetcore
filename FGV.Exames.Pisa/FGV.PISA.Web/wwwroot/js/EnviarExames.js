$(document).ready(function () {

    moment.locale("pt-br");
    $("#fileselector").change(function (e) { BuscarResultado(); });    

    $("#exemasID").change(function (e) { HabilitarBotao(); });
    InicializeTable();

    $('#btnUpload').click(function () {
        document.getElementById('fileselector').click();
    });

    $('#btnConfirmar').click(function () {
        SalvarExames();
    });
    $('#btnCancelar').click(function () {
        LimparTela();
    });

    $("#overlay").hide();

    HabilitarBotao(); 
});


function InicializeTable() {
    if (!jQuery().dataTable) {
        return;
    }
    $('#tb_dadosBancarios').DataTable({
        ordering: false,
        searching: false,
        destroy: true,
        columns: [            
            { "width": "5%" },
            { "width": "20%" },
            { "width": "40%" },
            { "width": "40%" },         
            { "width": "2%" }
        ],
    }).destroy();
}

function GetData() {

    RemoveDuplicados();
    var itemfiles = $("#fileselector")[0].files;
    
    var files = new Array();
    
    for (let i = 0; i < itemfiles.length; i++) {
        
            files.push({ id: i, dataEnvio: moment().format('L'), usuario: $("#NomeUsuario").val(), arquivo: itemfiles[i].name });
        
        
    }
    HabilitarBotao();
    return files;
}

function HabilitarBotao() {
    var exames_pisa_id = $('#exemasID').val();
    var itemfiles = $("#fileselector")[0].files;

    if (exames_pisa_id > 0 && itemfiles.length > 0) {
        $('#btnConfirmar').prop("disabled", false);
        $('.tooltiptext').text("");
    }
    else {
        $('#btnConfirmar').prop("disabled", true);
        $('.tooltiptext').text("Selecione o exame e os arquivos à serem enviados.")
    }
}

function BuscarResultado() {

    $('#tb_Arquivos').dataTable({
        data: GetData(),
        destroy: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese-Brasil.json",
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        createdRow: function (row, data, index) {
            $('td', row).eq(5).addClass('text-center');
        },
        columnDefs: [
            {
                targets: 4,
                data: "id",
                render: function (data, type, full, meta) {
                    return '<button type="button" class="btn blue btn-outline"  onclick="RemoveFile(' + data + ')">Remover</button>';
                }
            }
        ],
        columns: [
            { "data": "id" },
            { "data": "dataEnvio" },
            { "data": "usuario" },
            { "data": "arquivo" },
            { "data": "id" },

        ],
        "processing": true,
        ordering: false,
        searching: false
    });
}

function ResultadosViewModel(id_usuario, exames_pisa_id ) {
    this.id_usuario = id_usuario;
    this.exames_pisa_id = exames_pisa_id; 
}

function SalvarExames() {
    try {
        var exames_pisa_id = $('#exemasID').val();
        var id_usuario = $('#id_usuario').val();

        var fileItens = $("#fileselector")[0].files; 

        var formData = new FormData();
        for (var i = 0; i != fileItens.length; i++) {
            formData.append("files", fileItens[i]);
        }

        for (var i = 0; i != alunosIds.length; i++) {
            formData.append("Alunos[" + i + "].Id", alunosIds[i]);
            var presente = $("#presente-" + alunosIds[i]).is(':checked');
            formData.append("Alunos[" + i + "].Presente", presente);
        }

        formData.append("resultadosViewModel", JSON.stringify(new ResultadosViewModel(id_usuario, exames_pisa_id)));
        
        $.ajax(
            {
                url: "/EnviarExames/GravarResultados",               
                data: formData,
                type: 'post',
                processData: false,
                contentType: false,

                beforeSend: function () {
                    $("#overlay").show();
                },
                // hides the loader after completion of request, whether successfull or failor.             
                complete: function () {
                    $("#overlay").hide();
                },

                success: function (data) {
                    if (data.error == true) {
                        swal({
                            title: "Atenção!",
                            text: data.message,
                            type: "error"
                        });
                        return;
                    }
                    swal({
                        title: "Resultados enviados com sucesso",
                        text: "Todos os resultados foram processados",
                        type: "success"
                    }
                    , function () {
                        window.location.href = "../Home/index";
                    });

                    $('#exemasID').val("");
                    $("#fileselector")[0].value = "";
                    BuscarResultado();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    
                }
            });
                
        
    } catch (e) {
        swal("Erro, entre em contato com o suporte", e, "error");
    }
}

function FileListItems(files) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer()
    for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i])
    return b.files
}

function RemoveDuplicados() {
    var fileItens = $("#fileselector")[0].files;
    var RFile = $("#RFile").val()
    var fileBuffer = [];    
    Array.prototype.push.apply(fileBuffer, fileItens);
    var filesNames = new Array();

    for (let i = fileItens.length-1; i >-1; i--) {
        var valido = fileItens[i].name.match(RFile);
        if (filesNames.includes(fileItens[i].name) === false && valido != null) {
            filesNames.push(fileItens[i].name);
        }
        else {
            fileBuffer.splice(i, 1);
        }
    }
    
    $("#fileselector")[0].files = new FileListItems(fileBuffer) 
}

function RemoveFile(item) {
    var fileItens = $("#fileselector")[0].files;
    var fileBuffer = [];

    swal({
        title: "Atenção!",
        text: "Realmente deseja remover o arquivo \n" + $("#fileselector")[0].files[item].name + " ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Remover',
        cancelButtonText: "Cancelar"
    }, function (isConfirm) {

        if (isConfirm) {
            Array.prototype.push.apply(fileBuffer, fileItens);
            fileBuffer.splice(item, 1);
            $("#fileselector")[0].files = new FileListItems(fileBuffer)
            BuscarResultado();
        }
    });
}

function LimparTela() {
    var exames_pisa_id = $('#exemasID').val();
    var itemfiles = $("#fileselector")[0].files;

    if (exames_pisa_id > 0 || itemfiles.length > 0) {
        swal({
            title: "Atenção!",
            text: "Realmente deseja apagar todos os dados?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Confirmar',
            cancelButtonText: "Cancelar"
        }, function (isConfirm) {

            if (isConfirm) {
                $('#exemasID').val("");
                $("#fileselector")[0].value = "";
                BuscarResultado();
            }
        });
    }
}