-- v8.1.140 play events (run_stats mode='event') · paste into Supabase SQL Editor
-- 1) First-10-minute funnel: how many installs reached each step
select step, count(distinct install_id) as players from (
  select install_id, case
    when result='session' then '1 opened game'
    when result='tutorial_done' then '2 finished tutorial'
    when result='stage_start' and stage='C1-1' then '3 started C1-1'
    when mode<>'event' and stage='C1-1' and result='win' then '4 cleared C1-1'
    when result='stage_start' and stage='C1-2' then '5 started C1-2'
    when mode<>'event' and stage='C1-5' and result='win' then '6 cleared Chapter 1'
  end as step from run_stats where created_at > now() - interval '30 days') t
where step is not null group by step order by step;

-- 2) Where players stop: last event of each install not seen for 2+ days
select last_result, last_stage, count(*) as players from (
  select distinct on (install_id) install_id, result as last_result, coalesce(stage, data->>'s') as last_stage, created_at
  from run_stats order by install_id, created_at desc) t
where created_at < now() - interval '2 days' group by 1,2 order by 3 desc limit 30;

-- 3) Deaths and quits per stage
select stage, result, count(*) from run_stats where mode<>'event' and result in ('dead','quit','win')
group by 1,2 order by 1,2;

-- 4) Rewarded ads: watched / closed early / no ad, by place
select data->>'where' as place, data->>'r' as result, count(*) from run_stats
where result='ad' group by 1,2 order by 1,2;
