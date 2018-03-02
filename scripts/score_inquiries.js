/* Make the main table (score of credits) selectable. */
var centerBody = document.getElementsByTagName('center')[0]
if (centerBody) {
    var mainTable = document.getElementsByTagName('table')[0];
    mainTable.setAttribute('id', 'main-table');

    $('#main-table td').on('click', function () {
        var tr = $(this).parent();
        if (tr.hasClass('selected')) {
            tr.removeClass('selected');
        } else {
            tr.addClass('selected');
        }
    });

    /* Create GPA table. */
    var GPA = document.createElement('div');
    var GPATitle = document.createElement('span');
    var GPAPoints = document.createElement('span');
    var GPAModes = document.createElement('div');
    var selectAction = document.createElement('div');

    var modesOptions = ['NCU(4.0)', 'NTU(4.3)'];
    modesOptions.forEach(element => {
        var input = document.createElement('input');
        var label = document.createElement('label');
        var bigSpan = document.createElement('span');
        var smallSpan = document.createElement('span');
        input.type = 'radio';
        input.value = element;
        input.id = 'Mode' + element;
        input.name = 'modes';
        label.className = 'radio';
        label.setAttribute('for', 'Mode' + element);
        bigSpan.className = 'big';
        smallSpan.className = 'small';
        bigSpan.appendChild(smallSpan);
        label.appendChild(bigSpan);
        label.appendChild(document.createTextNode(element))
        GPAModes.appendChild(input);
        GPAModes.appendChild(label);
    });

    GPA.id = 'GPA';
    GPATitle.id = 'GPATitle';
    GPATitle.innerHTML = 'GPA';
    GPAPoints.id = 'GPAPoints';
    GPAPoints.innerHTML = '--';
    GPAModes.id = 'GPAModes';
    selectAction.id = 'select-action';

    GPA.appendChild(GPATitle);
    GPA.appendChild(GPAPoints);
    GPA.appendChild(GPAModes);
    GPA.appendChild(selectAction);
    centerBody.appendChild(GPA);
}