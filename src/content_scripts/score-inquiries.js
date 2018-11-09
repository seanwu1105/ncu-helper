import { insertCSS } from './common'

(function () {
  let use = true
  if (use) insertCSS(chrome.runtime.getURL('stylesheets/score-inquiries.css'))
  let gpa = true
  if (gpa) {
    insertCSS(chrome.runtime.getURL('stylesheets/gpa.css'))
    document.addEventListener('DOMContentLoaded', () => { buildGpaCalculator() })
  }
})()

/**
 * Build the GPA calculator and append it in the bottom of the page.
 */
function buildGpaCalculator () {
  const centerBody = document.getElementsByTagName('center')[0]
  let scoreCol, gpaPanelPoint

  /**
   * Get a list of GPA.
   * @return {{num, num}[]} List of pair {credit, gp}.
   */
  function getGpList () {
    const gpList = []
    for (let score of scoreCol) {
      if (isValidScore(score) && score.classList.contains('selected')) {
        gpList.push({
          credit: Number(score.children[3].innerText),
          gp: Number(score.children[5].innerText)
        })
      }
    }
    return gpList
  }

  /**
   * Append GPA score for each row.
   * @param {NodeList} tr The first number.
   * @return {bool} The sum of the two numbers.
   */
  function isValidScore (tr) {
    const score = parseInt(tr.children[4].innerText)
    if (Number.isInteger(score)) return true
    return false
  }

  /**
   * Append GPA for each curriculum.
   * @param {func} modeFunc 'convertScore2NCUGP' or
   *                        'convertScore2NTUGP'.
   */
  function insertGpaTableData (modeFunc) {
    for (let score of scoreCol) {
      if (isValidScore(score)) {
        score.children[5].innerText = modeFunc(score.children[4].innerText)
      }
    }
    gpaPanelPoint.innerText = calculateGpa(getGpList())
  }

  /**
   * Deselect all curriculum, and reset the GPA to 0.
   */
  function deselectAll () {
    for (let score of scoreCol) {
      if (score.classList.contains('selected')) score.classList.remove('selected')
    }
    gpaPanelPoint.innerText = calculateGpa(getGpList())
  }

  if (centerBody) {
    // Append GPA column.
    const mainTable = document.getElementsByTagName('table')[0]
    mainTable.id = 'main-table'
    const GpaHeader = document.createElement('td')
    GpaHeader.innerText = '量尺分數 (GPA Calculator)'
    const mainTableBody = mainTable.firstElementChild
    mainTableBody.firstElementChild.appendChild(GpaHeader)
    scoreCol = mainTableBody.querySelectorAll('tr.list1')
    for (let score of scoreCol) {
      score.appendChild(document.createElement('td'))
    }

    centerBody.querySelectorAll('#main-table tr.list1 td').forEach(
      node => node.addEventListener('click', () => {
        const tr = node.parentNode
        if (tr.classList.contains('selected')) tr.classList.remove('selected')
        else tr.classList.add('selected')
        gpaPanelPoint.innerText = calculateGpa(getGpList())
      })
    )

    // Extend the row of td.list3
    centerBody.querySelectorAll('tr.list3 td[colspan]').forEach(
      node => node.setAttribute('colspan', '6')
    )

    // Create GPA table.
    const gpaPanel = document.createElement('div')
    const ncuHelperIconCell = document.createElement('div')
    const ncuHelperIcon = document.createElement('img')
    ncuHelperIcon.src = chrome.extension.getURL('icons/48.png')
    ncuHelperIcon.alt = 'NCU Helper'
    ncuHelperIcon.title = 'NCU Helper'
    ncuHelperIcon.id = 'ncu-helper-icon'
    ncuHelperIconCell.appendChild(ncuHelperIcon)
    const gpaPanelTitle = document.createElement('span')
    gpaPanelPoint = document.createElement('span')
    const gpaModes = document.createElement('div')

    /* Modes */
    const modesOptions = ['NCU(4.0)', 'NTU(4.3)']
    modesOptions.forEach(element => {
      const input = document.createElement('input')
      const label = document.createElement('label')
      const bigSpan = document.createElement('span')
      const smallSpan = document.createElement('span')
      input.type = 'radio'
      input.value = element
      input.id = 'Mode' + element
      input.name = 'modes'
      label.className = 'radio'
      label.setAttribute('for', 'Mode' + element)
      bigSpan.className = 'big'
      smallSpan.className = 'small'
      bigSpan.appendChild(smallSpan)
      label.appendChild(bigSpan)
      label.appendChild(document.createTextNode(element))
      gpaModes.appendChild(input)
      gpaModes.appendChild(label)
    })

    /* Select Actions */
    const selectAllBtn = document.createElement('button')
    const selectMajorBtn = document.createElement('button')
    const selectLast60Btn = document.createElement('button')
    const selectSeniorJuniorBtn = document.createElement('button')
    const deselectAllBtn = document.createElement('button')
    selectAllBtn.innerText = '全選'
    selectMajorBtn.innerText = '全選必修'
    selectLast60Btn.innerText = '全選最後 60 學分'
    selectSeniorJuniorBtn.innerText = '全選大三四課程'
    deselectAllBtn.innerText = '取消全選'

    gpaPanel.id = 'GPA'
    gpaPanelTitle.id = 'GPATitle'
    gpaPanelTitle.innerText = 'GPA'
    gpaPanelPoint.id = 'GPAPoints'
    gpaPanelPoint.innerText = 0
    gpaModes.id = 'GPAModes'

    gpaPanel.appendChild(ncuHelperIconCell)
    gpaPanel.appendChild(gpaPanelTitle)
    gpaPanel.appendChild(gpaPanelPoint)
    gpaPanel.appendChild(gpaModes)
    gpaPanel.appendChild(selectAllBtn)
    gpaPanel.appendChild(selectMajorBtn)
    gpaPanel.appendChild(selectLast60Btn)
    gpaPanel.appendChild(selectSeniorJuniorBtn)
    gpaPanel.appendChild(deselectAllBtn)
    centerBody.appendChild(gpaPanel)

    document.getElementById('ModeNCU(4.0)').checked = true

    deselectAllBtn.onclick = deselectAll

    selectAllBtn.onclick = () => {
      for (let score of scoreCol) {
        if (isValidScore(score) &&
            !score.classList.contains('selected')) {
          score.classList.add('selected')
        }
      }
      gpaPanelPoint.innerText = calculateGpa(getGpList())
    }
    selectMajorBtn.onclick = () => {
      deselectAll()
      for (let score of scoreCol) {
        if (isValidScore(score) && !score.classList.contains('selected') &&
            score.children[1].innerHTML === '必') {
          score.classList.add('selected')
        }
      }
      gpaPanelPoint.innerText = calculateGpa(getGpList())
    }
    selectLast60Btn.onclick = () => {
      deselectAll()
      let i = scoreCol.length - 1
      let totalCredits = 0
      while (totalCredits < 60 && i >= 0) {
        if (isValidScore(scoreCol[i]) &&
            !scoreCol[i].classList.contains('selected') &&
            Number(scoreCol[i].children[3].innerText) !== 0) {
          totalCredits += Number(scoreCol[i].children[3].innerText)
          scoreCol[i].classList.add('selected')
        }
        i--
      }
      gpaPanelPoint.innerText = calculateGpa(getGpList())
    }

    selectSeniorJuniorBtn.onclick = () => {
      deselectAll()
      const firstYear = Number(
        scoreCol[0].firstElementChild.innerText.slice(0, -1))
      for (let score of scoreCol) {
        if (isValidScore(score) &&
            !score.classList.contains('selected') &&
            Number(score.firstElementChild.innerText.slice(0, -1)) - firstYear >= 2) {
          score.classList.add('selected')
        }
      }
      gpaPanelPoint.innerText = calculateGpa(getGpList())
    }

    centerBody.querySelectorAll('label[for="ModeNCU(4.0)"').forEach(
      node => node.addEventListener('click', () => {
        insertGpaTableData(convertScore2NCUGP)
      })
    )
    centerBody.querySelectorAll('label[for="ModeNTU(4.3)"').forEach(
      node => node.addEventListener('click', () => {
        insertGpaTableData(convertScore2NTUGP)
      })
    )

    insertGpaTableData(convertScore2NCUGP)
  }

  /**
   * Calculate and update the GPA.
   * @param {{num, num}[]} gpList List of pair {credit, gp}.
   * @return {num}
   */
  function calculateGpa (gpList) {
    let totalGp = 0
    let totalCredits = 0
    for (let item of gpList) {
      totalGp += item.credit * item.gp
      totalCredits += item.credit
    }
    if (totalCredits === 0) return 0
    else return (totalGp / totalCredits).toFixed(5)
  }

  /**
   * Convert score to NCU grade point.
   * @param {num} score The first number.
   * @return {num} The sum of the two numbers.
   */
  function convertScore2NCUGP (score) {
    score = Number(score)
    if (score >= 80) return 4
    if (score >= 70) return 3
    if (score >= 60) return 2
    if (score >= 1) return 1
    return 0
  }

  /**
   * Convert score to NTU grade point.
   * @param {num} score The first number.
   * @return {num} The sum of the two numbers.
   */
  function convertScore2NTUGP (score) {
    score = Number(score)
    if (score >= 90) return 4.3
    if (score >= 85) return 4
    if (score >= 80) return 3.7
    if (score >= 77) return 3.3
    if (score >= 73) return 3.0
    if (score >= 70) return 2.7
    if (score >= 67) return 2.3
    if (score >= 63) return 2.0
    if (score >= 60) return 1.7
    return 0
  }
}
