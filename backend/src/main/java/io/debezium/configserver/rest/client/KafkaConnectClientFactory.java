package io.debezium.configserver.rest.client;

import io.debezium.configserver.model.KafkaConnectClusterList;
import io.debezium.configserver.rest.LifecycleResource;
import io.debezium.configserver.rest.model.ServerError;
import io.debezium.configserver.service.StacktraceHelper;
import io.smallrye.config.SmallRyeConfig;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.rest.client.RestClientBuilder;
import org.jboss.logging.Logger;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

public class KafkaConnectClientFactory {

    public static final String PROPERTY_KAFKA_CONNECT_URI = "kafka.connect.uri";
    private static final Logger LOGGER = Logger.getLogger(LifecycleResource.class);

    private static List<String> kafkaConnectBaseUris;
    private static KafkaConnectClusterList kafkaConnectBaseURIsList;

    private static List<String> getKafkaConnectBaseUris() {
        if (null == kafkaConnectBaseUris) {
            try {
                kafkaConnectBaseUris = ((SmallRyeConfig) ConfigProvider.getConfig()).getValues(PROPERTY_KAFKA_CONNECT_URI, String.class, ArrayList::new);
            } catch (NoSuchElementException e) {
                kafkaConnectBaseUris = Collections.singletonList("http://localhost:8083");
            }
            if (null == kafkaConnectBaseUris || kafkaConnectBaseUris.isEmpty()) {
                kafkaConnectBaseUris = Collections.singletonList("http://localhost:8083");
            }
        }
        return kafkaConnectBaseUris;
    }

    public static KafkaConnectClusterList getAllKafkaConnectClusters() throws InvalidClusterException {
        if (null == kafkaConnectBaseURIsList) {
            kafkaConnectBaseURIsList = new KafkaConnectClusterList(getKafkaConnectBaseUris().size());
            for (String s : getKafkaConnectBaseUris()) {
                try {
                    kafkaConnectBaseURIsList.add(new URI(s.trim()));
                } catch (URISyntaxException e) {
                    throw new InvalidClusterException(
                            new ServerError(
                                    "Error parsing Kafka Connect cluster URI \"" + s.trim() + "\": " + e.getMessage(),
                                    StacktraceHelper.traceAsString(e)));
                }
            }
        }
        return kafkaConnectBaseURIsList;
    }

    /**
     * @param cluster the number of the cluster in the list of configured cluster URIs in #PROPERTY_KAFKA_CONNECT_URI (1, 2, 3, ...)
     *
     * @return the URI for the selected cluster
     */
    public static URI getKafkaConnectURIforCluster(int cluster) throws InvalidClusterException {
        KafkaConnectClusterList baseURIsList = getAllKafkaConnectClusters();

        if (baseURIsList.isEmpty()) {
            throw new InvalidClusterException(
                    new ServerError(
                            "Kafka Connect cluster list is empty! Did you forget to set a value for configuration property \"" + PROPERTY_KAFKA_CONNECT_URI + "\"?",
                            null));
        }

        if (baseURIsList.size() < cluster) {
            throw new InvalidClusterException(
                    new ServerError(
                            "Selected cluster (" + cluster + ") is not available in the list of configured clusters ["
                            + Arrays.toString(baseURIsList.toArray()) +"].",
                            null));
        }

        return baseURIsList.get(cluster - 1);
    }

    public static KafkaConnectClient getClient(int cluster) throws KafkaConnectException {
        URI kafkaConnectURI;
        KafkaConnectClient kafkaConnectClient;
        try {
            kafkaConnectURI = getKafkaConnectURIforCluster(cluster);
            kafkaConnectClient = RestClientBuilder.newBuilder()
                    .baseUri(kafkaConnectURI)
                    .build(KafkaConnectClient.class);
        } catch (RuntimeException | InvalidClusterException e) {
            String errorMessage = "Error on choosing the Kafka Connect cluster URI: " + e.getMessage();
            LOGGER.error(errorMessage);
            throw new KafkaConnectException(new ServerError(errorMessage, StacktraceHelper.traceAsString(e)));
        }
        return kafkaConnectClient;
    }

}
