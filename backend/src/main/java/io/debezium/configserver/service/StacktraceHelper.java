package io.debezium.configserver.service;

import java.util.Arrays;

public class StacktraceHelper {

    public static String traceAsString(Exception e) {
        return e.getStackTrace() != null && e.getStackTrace().length > 0 ? Arrays.toString(e.getStackTrace()) : null;
    }
}
