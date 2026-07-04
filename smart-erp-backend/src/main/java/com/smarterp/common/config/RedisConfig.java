package com.smarterp.common.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
public class RedisConfig implements CachingConfigurer {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        @SuppressWarnings("deprecation")
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(mapper);

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer));

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // 1 Hour TTL for roles, permissions, units, brands, warehouses, manufacturers
        RedisCacheConfiguration oneHourConfig = defaultConfig.entryTtl(Duration.ofHours(1));
        cacheConfigurations.put("roles", oneHourConfig);
        cacheConfigurations.put("permissions", oneHourConfig);
        cacheConfigurations.put("units", oneHourConfig);
        cacheConfigurations.put("brands", oneHourConfig);
        cacheConfigurations.put("warehouses", oneHourConfig);
        cacheConfigurations.put("manufacturers", oneHourConfig);

        // 30 Minutes TTL for ledger-groups, tax-categories, company-settings, companies, partners, stock-items, hsn
        RedisCacheConfiguration thirtyMinConfig = defaultConfig.entryTtl(Duration.ofMinutes(30));
        cacheConfigurations.put("ledger-groups", thirtyMinConfig);
        cacheConfigurations.put("tax-categories", thirtyMinConfig);
        cacheConfigurations.put("company-settings", thirtyMinConfig);
        cacheConfigurations.put("companies", thirtyMinConfig);
        cacheConfigurations.put("partners", thirtyMinConfig);
        cacheConfigurations.put("stock-items", thirtyMinConfig);
        cacheConfigurations.put("hsn", thirtyMinConfig);

        // 5 Minutes TTL for dashboard
        RedisCacheConfiguration fiveMinConfig = defaultConfig.entryTtl(Duration.ofMinutes(5));
        cacheConfigurations.put("dashboard", fiveMinConfig);

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }

    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
                log.warn("Redis Cache GET failed for cache {} with key {}: {}", cache.getName(), key, exception.getMessage());
            }

            @Override
            public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
                log.warn("Redis Cache PUT failed for cache {} with key {}: {}", cache.getName(), key, exception.getMessage());
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
                log.warn("Redis Cache EVICT failed for cache {} with key {}: {}", cache.getName(), key, exception.getMessage());
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {
                log.warn("Redis Cache CLEAR failed for cache {}: {}", cache.getName(), exception.getMessage());
            }
        };
    }

    @Bean
    public CommandLineRunner testRedisConnection(RedisConnectionFactory connectionFactory) {
        return args -> {
            try {
                log.info("=== STARTING REDIS CONFIG CONNECTION TEST ===");
                connectionFactory.getConnection().ping();
                log.info("=== REDIS CONFIG CONNECTION TEST SUCCESSFUL! Connected to Redis Cloud database. ===");
            } catch (Exception e) {
                log.error("=== REDIS CONFIG CONNECTION TEST FAILED! Error: {} ===", e.getMessage());
            }
        };
    }
}
