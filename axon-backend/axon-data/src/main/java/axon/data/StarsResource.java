package axon.data;

import axon.JedisWrapper;
import axon.data.api.StarCount;
import axon.data.api.StarResponse;
import axon.data.api.StarsService;
import redis.clients.jedis.Jedis;

public class StarsResource implements StarsService {

    private final JedisWrapper redis;

    public StarsResource(JedisWrapper redis) {
        this.redis = redis;
    }

    @Override
    public StarCount starCount(String modelId) {
        return StarCount.builder()
                .modelId(modelId)
                .count(1000)
                .build();
    }

    @Override
    public StarResponse star(String modelId, String token) {

        /*
         * Write directly to the database, then after the flush of the DB is complete, we write out
         * to redis an updated value for this.
         */
        String key = modelId + ":" + "/* username */";
        redis.executeWithRetries(jedis -> jedis.incr(key));

        // Assume successful completion here.
        return StarResponse.builder()
                .success(true)
                .build();
    }
}
