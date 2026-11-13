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

-- 5) Pillar 1 (docs/GAME_PILLARS.md): % of players who reach the Endgame
--    reached = cleared C3-5, or played any Endgame run (delve / pinnacle / rift), or opened the Delve map / Endgame / Depths screens
with p as (
  select install_id,
    bool_or(result='session') as opened,
    bool_or(mode='story' and stage='C1-5' and result='win') as ch1,
    bool_or(mode='story' and stage='C2-5' and result='win') as ch2,
    bool_or(mode='story' and stage='C3-5' and result='win') as ch3,
    bool_or(mode in ('delve','pinnacle','rift')
         or (result='screen' and data->>'s' in ('atlas','endgame','dig'))) as endgame_seen
  from run_stats where created_at > now() - interval '30 days' group by install_id)
select count(*) filter (where opened) as opened_game,
  count(*) filter (where ch1) as cleared_ch1,
  count(*) filter (where ch2) as cleared_ch2,
  count(*) filter (where ch3) as cleared_ch3,
  count(*) filter (where ch3 or endgame_seen) as reached_endgame,
  round(100.0 * count(*) filter (where ch3 or endgame_seen) / nullif(count(*) filter (where opened), 0), 1) as pct_reached_endgame
from p;

-- 6) Endgame farming: per player — Delve runs, deepest depth, days they came back to farm
select install_id,
  count(*) as endgame_runs,
  max((data->>'depth')::int) as deepest_delve,
  count(distinct created_at::date) as farm_days,
  max(created_at)::date as last_seen
from run_stats
where mode in ('delve','pinnacle','rift') and created_at > now() - interval '30 days'
group by install_id order by farm_days desc, deepest_delve desc nulls last limit 50;
