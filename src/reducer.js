import {
    parseData,
    pageInfo,
    formatServerError,
    formatGraphQLError,
    dispatchMutationResp,
    dispatchMutationErr,
    dispatchMutationReq,
} from '@openimis/fe-core';

function reducer(
    state = {
        fetchingPremiumsPayments: false,
        fetchedPremiumsPayments: false,
        errorPremiumsPayments: null,
        premiumsPayments: null,
        premiumsPaymentsPageInfo: { totalCount: 0 },
        payments: [],
        paymentsPageInfo: { totalCount: 0 },
        fetchingPayments: false,
        fetchedPayment: false,
        errorPayments: null,
        payment: null,
        fetchingPayment: false,
        errorPayment: null,
        submittingMutation: false,
        mutation: {},
    },
    action,
) {
    switch (action.type) {
        case 'INSUREE_FAMILY_OVERVIEW_REQ':
            return {
                ...state,
                fetchingPremiumsPayments: false,
                fetchedPremiumsPayments: false,
                premiumsPayments: null,
                premiumsPaymentsPageInfo: { totalCount: 0 },
                errorPremiumsPayments: null,
            }
        case 'POLICY_INSUREE_POLICIES_REQ':
        case 'POLICY_FAMILY_POLICIES_REQ':
        case 'CONTRIBUTION_POLICES_PREMIUMS_REQ':
        case 'PAYMENT_PREMIUMS_PAYMENTS_REQ':
            return {
                ...state,
                fetchingPremiumsPayments: true,
                fetchedPremiumsPayments: false,
                premiumsPayments: null,
                premiumsPaymentsPageInfo: { totalCount: 0 },
                errorPremiumsPayments: null,
            };
        case 'PAYMENT_PREMIUMS_PAYMENTS_RESP':
            return {
                ...state,
                fetchingPremiumsPayments: false,
                fetchedPremiumsPayments: true,
                premiumsPayments: parseData(action.payload.data.paymentsByPremiums),
                premiumsPaymentsPageInfo: pageInfo(action.payload.data.paymentsByPremiums),
                errorPremiumsPayments: formatGraphQLError(action.payload)
            };
        case 'PAYMENT_PREMIUMS_PAYMENTS_ERR':
            return {
                ...state,
                fetchingPremiumsPayments: false,
                errorPremiumsPayments: formatServerError(action.payload)
            };

        case 'PAYMENT_PAYMENTS_REQ':
            return {
                ...state,
                fetchingPayments: true,
                fetchedPayment: false,
                payments: null,
                paymentsPageInfo: { totalCount: 0 },
                errorPayments: null,
            };
        case 'PAYMENT_PAYMENTS_ERR':
            return {
                ...state,
                fetchingPayments: false,
                errorPayments: formatServerError(action.payload)
            };
        case 'PAYMENT_PAYMENTS_RESP':
            return {
                ...state,
                fetchingPayments: false,
                fetchedPayment: true,
                payments: parseData(action.payload.data.payments),
                paymentsPageInfo: pageInfo(action.payload.data.payments),
                errorPayments: formatGraphQLError(action.payload)
            };
        case 'PAYMENT_OVERVIEW_REQ':
            return {
                ...state,
                fetchingPayment: true,
                fetchedPayment: false,
                payment: null,
                errorPayment: null,
            };
        case 'PAYMENT_OVERVIEW_RESP':
            var payments = parseData(action.payload.data.payments);
            return {
                ...state,
                fetchingPayment: false,
                fetchedPayment: true,
                payment: (!!payments && payments.length > 0) ? payments[0] : null,
                errorPayment: formatGraphQLError(action.payload)
            };
        case 'PAYMENT_OVERVIEW_ERR':
            return {
                ...state,
                fetchingPayment: false,
                errorPayment: formatServerError(action.payload)
            };
        case 'PAYMENT_NEW':
            return {
                ...state,
                paymentsPageInfo : { totalCount: 0 },
                payment: null,
            };
        case 'PAYMENT_MUTATION_REQ':
            return dispatchMutationReq(state, action)
        case 'PAYMENT_MUTATION_ERR':
                return dispatchMutationErr(state, action);
        case 'PAYMENT_UPDATE_RESP':
            return dispatchMutationResp(state, "updatePayment", action);
        case 'PAYMENT_DELETE_RESP':
            return dispatchMutationResp(state, "deletePayment", action);
        case 'PAYMENT_CREATE_RESP':
            return dispatchMutationResp(state, "createPayment", action);
        default:
            return state;
    }
}

export default reducer;
