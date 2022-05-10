import { UseQueryOptions } from 'react-query/types';
import { reactive } from 'vue';
import { useQuery } from 'vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { gaugesSubgraphService } from '@/services/balancer/gauges/gauges-subgraph.service';
import { SubgraphGauge } from '@/services/balancer/gauges/types';

/**
 * TYPES
 */
type QueryResponse = SubgraphGauge[];

/**
 * @summary Fetches guages list from subgraph
 */
export default function useGaugesQuery(
  options: UseQueryOptions<QueryResponse> = {}
) {
  console.time('useGaugesQuery-load');
  console.time('useGaugesQuery-preQuery');
  /**
   * QUERY KEY
   */
  const queryKey = reactive(QUERY_KEYS.Gauges.All.Static());

  /**
   * QUERY FUNCTION
   */
  const queryFn = async () => {
    console.timeEnd('useGaugesQuery-preQuery');
    console.time('useGaugesQuery-query');
    try {
      const gauges = await gaugesSubgraphService.gauges.get();
      console.timeEnd('useGaugesQuery-query');
      return gauges;
    } catch (error) {
      console.error('Failed to fetch gauges', error);
      return [];
    }
  };

  /**
   * QUERY OPTIONS
   */
  const queryOptions = reactive({
    enabled: true,
    ...options
  });

  console.timeEnd('useGaugesQuery-load');
  return useQuery<QueryResponse>(queryKey, queryFn, queryOptions);
}
