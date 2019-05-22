(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$iiiiii (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/env/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 8) "\0e\00\00\00~\00l\00i\00b\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s")
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/allocator/arena/startOffset (mut i32) (i32.const 0))
 (global $~lib/allocator/arena/offset (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "levenshtein" (func $assembly/index/levenshtein))
 (export "memory.compare" (func $~lib/memory/memory.compare))
 (export "memory.allocate" (func $~lib/memory/memory.allocate))
 (export "memory.free" (func $~lib/memory/memory.free))
 (export "memory.reset" (func $~lib/memory/memory.reset))
 (start $start)
 (func $~lib/string/String#charCodeAt (; 1 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 0
   i32.const 8
   i32.const 75
   i32.const 4
   call $~lib/env/abort
   unreachable
  end
  local.get $1
  local.get $0
  i32.load
  i32.ge_u
  if
   i32.const -1
   return
  end
  local.get $0
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  i32.load16_u offset=4
 )
 (func $~lib/allocator/arena/__memory_allocate (; 2 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741824
  i32.gt_u
  if
   unreachable
  end
  local.get $0
  i32.const 1
  local.tee $1
  local.get $0
  local.get $1
  i32.gt_u
  select
  global.get $~lib/allocator/arena/offset
  local.tee $0
  i32.add
  i32.const 7
  i32.add
  i32.const -8
  i32.and
  local.tee $1
  current_memory
  local.tee $2
  i32.const 16
  i32.shl
  i32.gt_u
  if
   local.get $2
   local.get $1
   local.get $0
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.tee $4
   local.get $2
   local.get $4
   i32.gt_s
   select
   grow_memory
   i32.const 0
   i32.lt_s
   if
    local.get $3
    grow_memory
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $1
  global.set $~lib/allocator/arena/offset
  local.get $0
 )
 (func $assembly/index/min (; 3 ;) (type $FUNCSIG$iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  local.get $0
  local.get $1
  i32.lt_u
  local.tee $5
  if (result i32)
   local.get $5
  else   
   local.get $2
   local.get $1
   i32.lt_u
  end
  if (result i32)
   local.get $2
   i32.const 1
   i32.add
   local.get $0
   i32.const 1
   i32.add
   local.get $0
   local.get $2
   i32.gt_u
   select
  else   
   local.get $1
   local.get $1
   i32.const 1
   i32.add
   local.get $3
   local.get $4
   i32.eq
   select
  end
 )
 (func $assembly/index/levenshtein (; 4 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   i32.const 0
   return
  end
  local.get $0
  i32.load
  local.set $3
  local.get $1
  i32.load
  local.set $2
  loop $continue|0
   local.get $3
   i32.const 0
   i32.gt_u
   local.tee $4
   if (result i32)
    local.get $0
    local.get $3
    i32.const 1
    i32.sub
    call $~lib/string/String#charCodeAt
    local.get $1
    local.get $2
    i32.const 1
    i32.sub
    call $~lib/string/String#charCodeAt
    i32.eq
   else    
    local.get $4
   end
   if
    local.get $3
    i32.const 1
    i32.sub
    local.set $3
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    br $continue|0
   end
  end
  loop $continue|1
   local.get $6
   local.get $3
   i32.lt_u
   local.tee $4
   if (result i32)
    local.get $0
    local.get $6
    call $~lib/string/String#charCodeAt
    local.get $1
    local.get $6
    call $~lib/string/String#charCodeAt
    i32.eq
   else    
    local.get $4
   end
   if
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $continue|1
   end
  end
  local.get $2
  local.get $6
  i32.sub
  local.set $10
  local.get $3
  local.get $6
  i32.sub
  local.tee $2
  i32.eqz
  local.tee $3
  if (result i32)
   local.get $3
  else   
   local.get $10
   i32.const 3
   i32.lt_u
  end
  if
   local.get $10
   return
  end
  i32.const 0
  local.set $3
  local.get $2
  i32.const 0
  local.tee $2
  i32.sub
  i32.const 1
  i32.shl
  local.tee $11
  call $~lib/allocator/arena/__memory_allocate
  local.set $7
  loop $continue|2
   local.get $5
   local.get $11
   i32.lt_u
   if
    local.get $7
    local.get $5
    i32.const 65535
    i32.and
    i32.add
    local.get $2
    i32.const 1
    i32.add
    i32.store16
    local.get $5
    i32.const 1
    i32.add
    local.tee $4
    i32.const 1
    i32.add
    local.set $5
    local.get $7
    local.get $4
    i32.const 65535
    i32.and
    i32.add
    local.get $0
    block (result i32)
     local.get $2
     local.tee $4
     i32.const 1
     i32.add
     local.set $2
     local.get $4
     local.get $6
     i32.add
    end
    call $~lib/string/String#charCodeAt
    i32.store16
    br $continue|2
   end
  end
  loop $continue|3
   local.get $3
   i32.const 3
   i32.add
   i32.const 65535
   i32.and
   local.get $10
   i32.lt_u
   if
    local.get $1
    local.get $3
    local.tee $0
    local.get $6
    i32.add
    call $~lib/string/String#charCodeAt
    local.set $13
    local.get $1
    local.get $3
    i32.const 1
    i32.add
    local.tee $4
    local.get $6
    i32.add
    call $~lib/string/String#charCodeAt
    local.set $14
    local.get $1
    local.get $3
    i32.const 2
    i32.add
    local.tee $5
    local.get $6
    i32.add
    call $~lib/string/String#charCodeAt
    local.set $15
    local.get $1
    local.get $3
    i32.const 3
    i32.add
    local.tee $9
    local.get $6
    i32.add
    call $~lib/string/String#charCodeAt
    local.set $16
    local.get $3
    i32.const 4
    i32.add
    local.tee $3
    local.set $8
    i32.const 0
    local.set $2
    loop $repeat|4
     local.get $2
     local.get $11
     i32.lt_u
     if
      local.get $7
      local.get $2
      i32.const 65535
      i32.and
      i32.add
      local.get $2
      local.get $7
      i32.add
      i32.load16_u
      local.tee $17
      local.get $0
      local.get $4
      local.get $13
      local.get $2
      local.get $7
      i32.add
      i32.const 1
      i32.add
      i32.load16_u
      local.tee $12
      call $assembly/index/min
      local.tee $0
      local.get $4
      local.get $5
      local.get $14
      local.get $12
      call $assembly/index/min
      local.tee $4
      local.get $5
      local.get $9
      local.get $15
      local.get $12
      call $assembly/index/min
      local.tee $5
      local.get $9
      local.get $8
      local.get $16
      local.get $12
      call $assembly/index/min
      local.tee $8
      i32.store16
      local.get $5
      local.set $9
      local.get $4
      local.set $5
      local.get $0
      local.set $4
      local.get $17
      local.set $0
      local.get $2
      i32.const 2
      i32.add
      local.set $2
      br $repeat|4
     end
    end
    br $continue|3
   end
  end
  loop $continue|5
   local.get $3
   local.get $10
   i32.lt_u
   if
    local.get $1
    local.get $6
    local.get $3
    local.tee $0
    i32.add
    call $~lib/string/String#charCodeAt
    local.set $4
    local.get $3
    i32.const 1
    i32.add
    local.tee $3
    local.set $8
    i32.const 0
    local.set $2
    loop $repeat|6
     local.get $2
     local.get $11
     i32.lt_u
     if
      local.get $7
      local.get $2
      i32.const 65535
      i32.and
      i32.add
      local.get $7
      local.get $2
      i32.const 65535
      i32.and
      i32.add
      i32.load16_u
      local.tee $5
      local.get $0
      i32.lt_u
      local.tee $9
      if (result i32)
       local.get $9
      else       
       local.get $8
       local.get $0
       i32.lt_u
      end
      if (result i32)
       local.get $8
       i32.const 1
       i32.add
       local.get $5
       i32.const 1
       i32.add
       local.get $5
       local.get $8
       i32.gt_u
       select
      else       
       local.get $4
       local.get $7
       local.get $2
       i32.const 1
       i32.add
       i32.const 65535
       i32.and
       i32.add
       i32.load16_u
       i32.eq
       if (result i32)
        local.get $0
       else        
        local.get $0
        i32.const 1
        i32.add
       end
      end
      local.tee $8
      i32.store16
      local.get $5
      local.set $0
      local.get $2
      i32.const 2
      i32.add
      local.set $2
      br $repeat|6
     end
    end
    br $continue|5
   end
  end
  local.get $8
 )
 (func $~lib/internal/memory/memcmp (; 5 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   i32.const 0
   return
  end
  loop $continue|0
   local.get $2
   i32.const 0
   i32.ne
   local.tee $3
   if (result i32)
    local.get $0
    i32.load8_u
    local.get $1
    i32.load8_u
    i32.eq
   else    
    local.get $3
   end
   if
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $continue|0
   end
  end
  local.get $2
  if (result i32)
   local.get $0
   i32.load8_u
   local.get $1
   i32.load8_u
   i32.sub
  else   
   i32.const 0
  end
 )
 (func $~lib/memory/memory.compare (; 6 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  local.get $1
  local.get $2
  call $~lib/internal/memory/memcmp
 )
 (func $~lib/memory/memory.allocate (; 7 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  call $~lib/allocator/arena/__memory_allocate
 )
 (func $~lib/memory/memory.free (; 8 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $~lib/memory/memory.reset (; 9 ;) (type $FUNCSIG$v)
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $start (; 10 ;) (type $FUNCSIG$v)
  i32.const 40
  global.set $~lib/allocator/arena/startOffset
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $null (; 11 ;) (type $FUNCSIG$v)
  nop
 )
)
