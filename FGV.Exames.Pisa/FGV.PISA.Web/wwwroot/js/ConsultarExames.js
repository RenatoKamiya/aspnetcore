$(document).ready(function () {

    $('#txt_DataInicial').mask('00/00/0000');
    $('#txt_DataFinal').mask('00/00/0000');


    var buttonCommon = {

        filename: 'relatorio_resultado_exames',
        title: 'Relatório de Resultado dos exmes',
        exportOptions: {

            format: {
                body: function (data, column, row, node) {

                    //if (column === 8 || column === 9)
                    //    return data === false ? "false" : "true"

                    return data;
                }
            }
        }
    };


    function BuscarResultado() {

        $('#tb_resultado').dataTable({
            ajax: ConvocacaoRelatorioGetData(),
            destroy: true,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese-Brasil.json",
                processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
            },
            drawCallback: function () {
                $("#btnBuscar").prop("disabled", false)
            },
            createdRow: function (row, data, index) {
                $('td', row).eq(5).addClass('text-center');
            },
            columnDefs: [{
                targets: 3, render: function (data) {
                    return moment(data).format('yyyy-MM-DD');
                }
            }],
            columns: [
                {"data": "id"},
                { "data": "aluno" },
                { "data": "escola" },
                { "data": "data_Envio" },
                { "data": "usuario" },                
                { "data": "nomeArquivo" }
            ],
            "processing": true,
            ordering: false,
            searching: false,
            buttons: [
                $.extend(true, {
                    className: 'btn purple btn-outline',

                }, buttonCommon, {
                    extend: 'excelHtml5'
                })
            ],
            dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
        });
    }

    InicializeTable();

    $('#btnBuscar').click(function () {
        $("#btnBuscar").prop("disabled", true)
        $('#tb_resultado').DataTable().destroy();
        BuscarResultado();
    });

    $("#IdEscola").change(function () {
        FillDropDownAluno();
    });
});

function FillDropDownAluno() {
    if ($("#IdEscola").val() === '') {
        $("#AlunosList").empty();
        $("#AlunosList").append("<option value>" + "---  Selecione ---" + " </option>")
    } else if ($("#txt_naturalidade").val() != '0') {
        $.get("/ConsultarExames/GetAlunosEscola/", { idEscola: $("#IdEscola").val() }, function (data) {
            $("#AlunosList").empty();
            $("#AlunosList").append("<option value>" + "---  Selecione ---" + " </option>")
            $.each(data, function (index, row) {
                $("#AlunosList").append("<option value='" + row.id + "'>" + row.codigoNome + "</option>")
            });
        });
    }
    else {
        $("#AlunosList").empty();
        $("#AlunosList").append("<option value>" + "---  Selecione ---" + " </option>");
    }

}


function ConvocacaoRelatorioGetData() {

    var filtros = $("#frmBusca").serialize();
    return {
        "url": `/ConsultarExames/GetResultadoConsulta?${filtros}`, "type": "POST"
    };
}

function InicializeTable() {
    if (!jQuery().dataTable) {
        return;
    }
    $('#tb_resultado').DataTable({
        ordering: false,
        searching: false,
        destroy: true,
        columns: [
            { "width": "5%" },
            { "width": "30%" },
            { "width": "30%" },
            { "width": "10%" },
            { "width": "30%" },
            { "width": "30%" }
        ],
    }).destroy();
}