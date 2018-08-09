/**
 * Author: Sean Wu
 * NCU CSIE, Taiwan
 */

chrome.storage.sync.get('score-inquiries', (result) => {
    if (result['score-inquiries']) {
        // load css.
        const link = document.createElement('link');
        link.setAttribute('href', chrome.extension.getURL(
            'stylesheets/score-inquiries.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);
    }
});

chrome.storage.sync.get('gpa', (result) => {
    if (result.gpa) {
        const link = document.createElement('link');
        link.setAttribute(
            'href', chrome.extension.getURL('stylesheets/gpa.css'));
        link.setAttribute('rel', 'stylesheet');
        const head = document.head || document.getElementsByTagName('head')[0]
            || document.documentElement;
        head.insertBefore(link, head.lastChild);
        $(document).ready(() => {
            buildGpaCalculator();
        });
    }
});

/**
 * Build the GPA calculator and append it in the bottom of the page.
 */
function buildGpaCalculator() {
    const centerBody = document.getElementsByTagName('center')[0];
    if (centerBody) {
        /**
         * Get a list of GPA.
         * @return {{num, num}[]} List of pair {credit, gp}.
         */
        function getGpList() {
            let gpList = [];
            for (let i = 0; i < scoreCol.length; i++) {
                if (isValidScore(scoreCol[i]) &&
                    scoreCol[i].classList.contains('selected')) {
                    gpList.push({
                        credit: Number(scoreCol[i].children[3].innerHTML),
                        gp: Number(scoreCol[i].children[5].innerHTML),
                    });
                }
            }
            return gpList;
        }

        /**
         * Append GPA score for each row.
         * @param {NodeList} tr The first number.
         * @return {bool} The sum of the two numbers.
         */
        function isValidScore(tr) {
            const score = parseInt(tr.children[4].innerHTML);
            if (Number.isInteger(score)) return true;
            return false;
        }

        /**
         * Append GPA for each curriculum.
         * @param {func} modeFunc 'convertScore2NCUGP' or
         *                        'convertScore2NTUGP'.
         */
        function insertGpaTableData(modeFunc) {
            for (let i = 0; i < scoreCol.length; i++) {
                if (isValidScore(scoreCol[i])) {
                    scoreCol[i].children[5].innerHTML
                        = modeFunc(scoreCol[i].children[4].innerHTML);
                }
            }
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        }

        /**
         * Deselect all curriculum, and reset the GPA to 0.
         */
        function deselectAll() {
            for (let i = 0; i < scoreCol.length; i++) {
                if (scoreCol[i].classList.contains('selected')) {
                    scoreCol[i].classList.remove('selected');
                }
            }
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        }

        // Append GPA column.
        const mainTable = document.getElementsByTagName('table')[0];
        mainTable.setAttribute('id', 'main-table');
        const GpaHeader = document.createElement('td');
        GpaHeader.innerHTML = 'GPA Score';
        const mainTableBody = mainTable.firstElementChild;
        mainTableBody.firstElementChild.appendChild(GpaHeader);
        const scoreCol = mainTableBody.querySelectorAll('tr.list1');
        for (let i = 0; i < scoreCol.length; i++) {
            scoreCol[i].appendChild(document.createElement('td'));
        }

        /**
         * Make the main table (score of credits) selectable.
         * Use 'event.currentTarget' instead of 'this' to avoid ESLint
         * error.
         * https://github.com/eslint/eslint/issues/632#issuecomment-164742012
         */
        $('#main-table tr.list1 td').on('click', () => {
            const tr = $(event.currentTarget).parent();
            if (tr.hasClass('selected')) tr.removeClass('selected');
            else tr.addClass('selected');
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        });

        // Extend the row of td.list3
        $('tr.list3 td[colspan]').attr('colspan', '6');

        // Create GPA table.
        const gpaPanel = document.createElement('div');
        const gpaPanelTitle = document.createElement('span');
        const gpaPanelPoint = document.createElement('span');
        const gpaModes = document.createElement('div');

        /* Modes */
        const modesOptions = ['NCU(4.0)', 'NTU(4.3)'];
        modesOptions.forEach((element) => {
            const input = document.createElement('input');
            const label = document.createElement('label');
            const bigSpan = document.createElement('span');
            const smallSpan = document.createElement('span');
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
            label.appendChild(document.createTextNode(element));
            gpaModes.appendChild(input);
            gpaModes.appendChild(label);
        });

        /* Select Actions */
        const selectAllBtn = document.createElement('button');
        const selectMajorBtn = document.createElement('button');
        const selectLast60Btn = document.createElement('button');
        const selectSeniorJuniorBtn = document.createElement('button');
        const deselectAllBtn = document.createElement('button');
        selectAllBtn.innerHTML = 'Select All';
        selectMajorBtn.innerHTML = 'Select All Major';
        selectLast60Btn.innerHTML = 'Select Last 60 Credits';
        selectSeniorJuniorBtn.innerHTML
            = 'Select All Senior/Junior Courses';
        deselectAllBtn.innerHTML = 'Deselect All';

        gpaPanel.id = 'GPA';
        gpaPanelTitle.id = 'GPATitle';
        gpaPanelTitle.innerHTML = 'GPA';
        gpaPanelPoint.id = 'GPAPoints';
        gpaPanelPoint.innerHTML = 0;
        gpaModes.id = 'GPAModes';

        gpaPanel.appendChild(gpaPanelTitle);
        gpaPanel.appendChild(gpaPanelPoint);
        gpaPanel.appendChild(gpaModes);
        gpaPanel.appendChild(selectAllBtn);
        gpaPanel.appendChild(selectMajorBtn);
        gpaPanel.appendChild(selectLast60Btn);
        gpaPanel.appendChild(selectSeniorJuniorBtn);
        gpaPanel.appendChild(deselectAllBtn);
        centerBody.appendChild(gpaPanel);

        document.getElementById('ModeNCU(4.0)').checked = true;

        deselectAllBtn.onclick = deselectAll;

        selectAllBtn.onclick = () => {
            for (let i = 0; i < scoreCol.length; i++) {
                if (isValidScore(scoreCol[i]) &&
                    !scoreCol[i].classList.contains('selected')) {
                    scoreCol[i].classList.add('selected');
                }
            }
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        };
        selectMajorBtn.onclick = () => {
            deselectAll();
            for (let i = 0; i < scoreCol.length; i++) {
                if (isValidScore(scoreCol[i]) &&
                    !scoreCol[i].classList.contains('selected') &&
                    scoreCol[i].children[1].innerHTML === '必') {
                    scoreCol[i].classList.add('selected');
                }
            }
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        };
        selectLast60Btn.onclick = () => {
            deselectAll();
            let i = scoreCol.length - 1;
            let totalCredits = 0;
            while (totalCredits < 60 && i >= 0) {
                if (isValidScore(scoreCol[i]) &&
                    !scoreCol[i].classList.contains('selected') &&
                    Number(scoreCol[i].children[3].innerHTML) !== 0) {
                    totalCredits += Number(
                        scoreCol[i].children[3].innerHTML);
                    scoreCol[i].classList.add('selected');
                }
                i--;
            }
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        };

        selectSeniorJuniorBtn.onclick = () => {
            deselectAll();
            const firstYear = Number(
                scoreCol[0].firstElementChild.innerHTML.slice(0, -1));
            for (let i = 0; i < scoreCol.length; i++) {
                if (isValidScore(scoreCol[i]) &&
                    !scoreCol[i].classList.contains('selected') &&
                    Number(scoreCol[i].firstElementChild
                        .innerHTML.slice(0, -1)) - firstYear >= 2) {
                    scoreCol[i].classList.add('selected');
                }
            }
            gpaPanelPoint.innerHTML = calculateGpa(getGpList());
        };

        $('label[for="ModeNCU(4.0)"').click(
            () => insertGpaTableData(convertScore2NCUGP));
        $('label[for="ModeNTU(4.3)"').click(
            () => insertGpaTableData(convertScore2NTUGP));

        insertGpaTableData(convertScore2NCUGP);
    }

    /**
     * Calculate and update the GPA.
     * @param {{num, num}[]} gpList List of pair {credit, gp}.
     * @return {num}
     */
    function calculateGpa(gpList) {
        let totalGp = 0;
        let totalCredits = 0;
        for (let pair of gpList) {
            totalGp += pair.credit * pair.gp;
            totalCredits += pair.credit;
        }
        if (totalCredits === 0) return 0;
        else return (totalGp / totalCredits).toFixed(5);
    }

    /**
     * Convert score to NCU grade point.
     * @param {num} score The first number.
     * @return {num} The sum of the two numbers.
     */
    function convertScore2NCUGP(score) {
        score = Number(score);
        if (score >= 80) return 4;
        if (score >= 70) return 3;
        if (score >= 60) return 2;
        if (score >= 1) return 1;
        return 0;
    }

    /**
     * Convert score to NTU grade point.
     * @param {num} score The first number.
     * @return {num} The sum of the two numbers.
     */
    function convertScore2NTUGP(score) {
        score = Number(score);
        if (score >= 90) return 4.3;
        if (score >= 85) return 4;
        if (score >= 80) return 3.7;
        if (score >= 77) return 3.3;
        if (score >= 73) return 3.0;
        if (score >= 70) return 2.7;
        if (score >= 67) return 2.3;
        if (score >= 63) return 2.0;
        if (score >= 60) return 1.7;
        return 0;
    }
}
