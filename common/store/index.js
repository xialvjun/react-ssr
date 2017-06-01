export { default as initApollo } from './initApollo'
export { default as initRedux } from './initRedux'

// function createApollo() {
//     if (process.browser && window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apollo) {
//         return initApollo({
//             initialState: window.__PRELOADED_STATE__.apollo
//         })
//     }
//     return initApollo()
// }

// function createRedux(apollo) {
//     if (process.browser && window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apollo) {
//         return initRedux(apollo, window.__PRELOADED_STATE__.apollo)
//     }
//     return initRedux(apollo)
// }

// export const apollo = createApollo()

// export const redux = createRedux(apollo)

// export default redux