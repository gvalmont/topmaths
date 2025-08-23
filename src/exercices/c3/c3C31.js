import ProblemeCourse from '../6e/6N5-9'
export const titre = 'Problème - Les courses'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const uuid = 'b74c6'
export const refs = {
  'fr-fr': ['c3C31'],
  'fr-ch': []
}
export default class ProblemeCourseC3 extends ProblemeCourse {
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup = true
  }
}
