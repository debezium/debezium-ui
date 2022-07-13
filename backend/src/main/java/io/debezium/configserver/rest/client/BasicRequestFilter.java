package io.debezium.configserver.rest.client;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import java.io.IOException;
import java.util.Base64;

@Priority(Priorities.AUTHENTICATION)

public class BasicRequestFilter implements ClientRequestFilter {

    @Override
    public void filter(ClientRequestContext requestContext) throws IOException {
        requestContext.getHeaders().add(HttpHeaders.AUTHORIZATION, getAccessToken());
    }

    private String getAccessToken() {
        String credentials = String.join(":",
                System.getenv("AUTH_USER"),
                System.getenv("AUTH_PASS"));

        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}
