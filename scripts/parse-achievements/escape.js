const data = {
    pupil_match_learning_events: {
        metric: 'pupil_match_learned_regular',
        aggregator: 'last_streak_length',
        createBuckets: 'by_weeks',
        bucketAggregator: 'presence_of_events',
    },
};

console.log(JSON.stringify(data));
