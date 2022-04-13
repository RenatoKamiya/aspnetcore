var basicTable;

var TableAdvanced = function () {
    var handleTableDefault = function (id) {
        RegistrarEventoOnCompleteDataTable(id);
        basicTable = $('#' + id).DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese-Brasil.json"
            },
            "order": [
                [0, 'asc']
            ],
            lengthMenu: [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            pageLength: 10,
            buttons: [
                { extend: 'print', text: 'Imprimir', className: 'btn dark btn-outline' },
                { extend: 'pdfHtml5', text: 'PDF', className: 'btn green btn-outline' },
                { extend: 'excelHtml5', text: 'Excel', className: 'btn purple btn-outline ' }
            ]
        });
    }

    var handleBasicTable = function (id, recordsForPage) {
        basicTable = $('#' + id).DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese-Brasil.json"
            },
            "order": [
                [0, 'asc']
            ],
            lengthMenu: [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            pageLength: recordsForPage,
            "dom": '<"top">rt<"bottom"p><"clear">'
        });
    }

    var handleTableDefaultWithoutButtons = function (id) {
        basicTable = $('#' + id).DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese-Brasil.json"
            },
            "paging": false,
            "order": [
                [0, 'asc']
            ],
            lengthMenu: [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            pageLength: 10,
            "dom": '<"top">rt<"bottom"p><"clear">'
        });
    }

    var handleTableDefaultAjax = function (id, urlAjax, arrayColluns) {
        //RegistrarEventoOnCompleteDataTable(id);
        basicTable = $('#' + id).dataTable({
            "language": {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese-Brasil.json"
            },
            "bServerSide": true,
            "ajax": {
                "url": urlAjax,
                "method": "POST"
            },
            "bProcessing": true,
            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"] // change per page values here
            ],
            pageLength: 10,
            buttons: [
                { extend: 'print', text: 'Imprimir', className: 'btn dark btn-outline' },
                { extend: 'pdfHtml5', text: 'PDF', className: 'btn green btn-outline' },
                { extend: 'excelHtml5', text: 'Excel', className: 'btn purple btn-outline ' }
            ]
        });
    }

    return {
        loadAllByClass: function () {
            if (!jQuery().dataTable) {
                return;
            }
            var tabelas = $('.table-responsive');
            $.each(tabelas, function (index, tabela) {
                $('#' + tabela.id).DataTable().destroy();
                handleTableDefault(tabela.id);
            });
        },
        loadTableDefault: function (id) {
            if (!jQuery().dataTable) {
                return;
            }
            $('#' + id).DataTable().destroy();
            handleTableDefault(id);
        },
        loadBasicTable: function (id, recordsForPage) {
            if (!jQuery().dataTable) {
                return;
            }
            $('#' + id).DataTable().destroy();
            handleBasicTable(id, recordsForPage);
        },
        loadTableDefaultWithoutButtons: function (id) {
            if (!jQuery().dataTable) {
                return;
            }
            $('#' + id).DataTable().destroy();
            handleTableDefaultWithoutButtons(id);
        },
        loadTableDefaultAjax: function (id, urlAjax, arrayColluns) {
            if (!jQuery().dataTable) {
                return;
            }
            $('#' + id).DataTable().destroy();
            handleTableDefaultAjax(id, urlAjax, arrayColluns);
        }
    };
}();

function GetTableBasic() {
    return basicTable;
}

function RegistrarEventoOnCompleteDataTable(id) {
    $('#' + id).on('init.dt', function () {
        $(document).ready(function () {
            basicTable.buttons(0, null).containers().appendTo('#div-buttons-' + id);
        });
    })
}