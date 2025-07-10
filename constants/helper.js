
const BAD_REQUEST_RESPONSE = "Bad Request";
const PENDING_STATUS = 0;
const ACTIVE_STATUS = 1;
const DEACTIVATE_STATUS = 2;
const DELETE_STATUS = 3;

const BAD_REQUEST = (res, message = "Validation failed") => {
    res.status(400).json({
        success: false,
        message,
    });
};
const SUCCESS_RESPONSE = (res, message, data) => {
    res.status(200).json({
        success: true,
        message,
        data
    });
}
const SUCCESS_RESPONSE_FOR_LIST = (res, data, totalCount, showPagination) => {
    res.status(200).json({
        success: true,
        data: {
            result: data,
            totalRecords: totalCount,
            showPagination: showPagination,
        },
    });
};

const SERVER_ERROR = (res, message = "Something went wrong") => {
    res.status(500).json({
        success: false,
        message,
    });
};

const VALIDATION_ERROR_RESPONSE = (res, message = "Validation failed", errors = []) => {
    res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
    });
};

module.exports = {
    BAD_REQUEST,
    PENDING_STATUS,
    ACTIVE_STATUS,
    DEACTIVATE_STATUS,
    DELETE_STATUS,
    BAD_REQUEST_RESPONSE,
    SUCCESS_RESPONSE,
    SUCCESS_RESPONSE_FOR_LIST,
    SERVER_ERROR,
    VALIDATION_ERROR_RESPONSE
};
